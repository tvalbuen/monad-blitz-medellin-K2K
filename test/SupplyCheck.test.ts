import { expect } from "chai";
import { ethers } from "hardhat";
import { SupplyCheck } from "../typechain-types";

// Mirrors contracts/SupplyCheck.sol enum Stage.
const Stage = {
  Production: 0,
  GlobalDistribution: 1,
  LocalDistribution: 2,
  FinalDelivery: 3,
} as const;

describe("SupplyCheck — entities/supplycheck-contract B1..B13", () => {
  async function deploy() {
    const [manufacturer, distributor, other] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("SupplyCheck");
    const contract = (await factory.deploy()) as unknown as SupplyCheck;
    await contract.waitForDeployment();
    return { contract, manufacturer, distributor, other };
  }

  // Drive a batch all the way to FinalDelivery.
  async function registerAndComplete(contract: SupplyCheck) {
    await contract.registerBatch("LOT-001", "Vaccine X", "{produccion}", true);
    await contract.transferCustody("LOT-001", Stage.GlobalDistribution, "{mundial}", true);
    await contract.transferCustody("LOT-001", Stage.LocalDistribution, "{local}", true);
    await contract.transferCustody("LOT-001", Stage.FinalDelivery, "{final}", true);
  }

  it("B1: registerBatch creates a Production record and emits BatchRegistered", async () => {
    const { contract, manufacturer } = await deploy();
    await expect(contract.registerBatch("LOT-001", "Vaccine X", "{}", true)).to.emit(
      contract,
      "BatchRegistered"
    );
    const v = await contract.verifyBatch("LOT-001");
    expect(v.exists).to.equal(true);
    expect(v.manufacturer).to.equal(manufacturer.address);
    expect(v.currentStage).to.equal(Stage.Production);
    const history = await contract.getBatchHistory("LOT-001");
    expect(history.length).to.equal(1);
    expect(history[0].stage).to.equal(Stage.Production);
    expect(history[0].actor).to.equal(manufacturer.address);
  });

  it("B2: registerBatch reverts on a duplicate batchId", async () => {
    const { contract } = await deploy();
    await contract.registerBatch("LOT-001", "Vaccine X", "{}", true);
    await expect(
      contract.registerBatch("LOT-001", "Vaccine X", "{}", true)
    ).to.be.revertedWithCustomError(contract, "BatchAlreadyExists");
  });

  it("B3: registerBatch with broken cold chain marks the batch compromised", async () => {
    const { contract } = await deploy();
    await expect(contract.registerBatch("LOT-002", "Insulin", "{}", false)).to.emit(
      contract,
      "BatchCompromised"
    );
    const v = await contract.verifyBatch("LOT-002");
    expect(v.compromised).to.equal(true);
    expect(v.authentic).to.equal(false);
  });

  it("B4: transferCustody appends the next stage and emits CustodyTransferred", async () => {
    const { contract, distributor } = await deploy();
    await contract.registerBatch("LOT-001", "Vaccine X", "{}", true);
    await expect(
      contract
        .connect(distributor)
        .transferCustody("LOT-001", Stage.GlobalDistribution, "{guia}", true)
    ).to.emit(contract, "CustodyTransferred");
    const v = await contract.verifyBatch("LOT-001");
    expect(v.currentStage).to.equal(Stage.GlobalDistribution);
    const history = await contract.getBatchHistory("LOT-001");
    expect(history.length).to.equal(2);
    expect(history[1].actor).to.equal(distributor.address);
  });

  it("B5: transferCustody reverts for an unknown batch", async () => {
    const { contract } = await deploy();
    await expect(
      contract.transferCustody("NOPE", Stage.GlobalDistribution, "{}", true)
    ).to.be.revertedWithCustomError(contract, "BatchNotFound");
  });

  it("B6: transferCustody with broken cold chain marks the batch compromised", async () => {
    const { contract } = await deploy();
    await contract.registerBatch("LOT-001", "Vaccine X", "{}", true);
    await expect(
      contract.transferCustody("LOT-001", Stage.GlobalDistribution, "{}", false)
    ).to.emit(contract, "BatchCompromised");
    const v = await contract.verifyBatch("LOT-001");
    expect(v.compromised).to.equal(true);
    expect(v.authentic).to.equal(false);
  });

  it("B7: transferCustody reverts when the stage is out of order", async () => {
    const { contract } = await deploy();
    await contract.registerBatch("LOT-001", "Vaccine X", "{}", true);
    // Skipping GlobalDistribution -> LocalDistribution is invalid.
    await expect(
      contract.transferCustody("LOT-001", Stage.LocalDistribution, "{}", true)
    ).to.be.revertedWithCustomError(contract, "InvalidStageTransition");
    // Repeating the current stage is also invalid.
    await expect(
      contract.transferCustody("LOT-001", Stage.Production, "{}", true)
    ).to.be.revertedWithCustomError(contract, "InvalidStageTransition");
    const v = await contract.verifyBatch("LOT-001");
    expect(v.currentStage).to.equal(Stage.Production);
  });

  it("B8: transferCustody reverts once the batch reached FinalDelivery", async () => {
    const { contract } = await deploy();
    await registerAndComplete(contract);
    await expect(
      contract.transferCustody("LOT-001", Stage.FinalDelivery, "{}", true)
    ).to.be.revertedWithCustomError(contract, "ChainComplete");
  });

  it("B9: verifyBatch returns authentic for an intact existing batch", async () => {
    const { contract } = await deploy();
    await contract.registerBatch("LOT-001", "Vaccine X", "{}", true);
    const v = await contract.verifyBatch("LOT-001");
    expect(v.exists).to.equal(true);
    expect(v.authentic).to.equal(true);
    expect(v.compromised).to.equal(false);
    expect(v.currentStage).to.equal(Stage.Production);
  });

  it("B10: verifyBatch returns compromised/non-authentic for a broken batch", async () => {
    const { contract } = await deploy();
    await contract.registerBatch("LOT-003", "Antibiotic", "{}", false);
    const v = await contract.verifyBatch("LOT-003");
    expect(v.compromised).to.equal(true);
    expect(v.authentic).to.equal(false);
  });

  it("B11: verifyBatch returns not-exists/non-authentic for an unknown batchId", async () => {
    const { contract } = await deploy();
    const v = await contract.verifyBatch("GHOST");
    expect(v.exists).to.equal(false);
    expect(v.authentic).to.equal(false);
  });

  it("B12: getBatchHistory returns all handoffs in chronological order", async () => {
    const { contract } = await deploy();
    await registerAndComplete(contract);
    const history = await contract.getBatchHistory("LOT-001");
    expect(history.length).to.equal(4);
    expect(history.map((h) => Number(h.stage))).to.deep.equal([
      Stage.Production,
      Stage.GlobalDistribution,
      Stage.LocalDistribution,
      Stage.FinalDelivery,
    ]);
  });

  it("B13: getBatchHistory returns an empty array for an unknown batchId", async () => {
    const { contract } = await deploy();
    const history = await contract.getBatchHistory("GHOST");
    expect(history.length).to.equal(0);
  });
});
