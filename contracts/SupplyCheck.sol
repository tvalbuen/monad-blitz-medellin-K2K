// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @title SupplyCheck
/// @notice On-chain custody ledger for medicine batches. A manufacturer registers a
///         batch; each subsequent actor appends an ordered, immutable custody handoff.
///         Anyone can verify a batch's authenticity and cold-chain integrity and read
///         its full history. No central authority, no editable record.
/// @dev    Spec: docs/wiki/entities/supplycheck-contract.md (Behavior cases B1..B13).
contract SupplyCheck {
    /// @notice Custody stages in order. A batch starts at Production and advances by one.
    enum Stage {
        Production,
        GlobalDistribution,
        LocalDistribution,
        FinalDelivery
    }

    /// @notice One recorded change of custody.
    struct Handoff {
        Stage stage;
        address actor;
        uint64 timestamp;
        string details;
        bool coldChainOk;
    }

    /// @notice Batch-level state. `authentic` is derived as `exists && !compromised`.
    struct Batch {
        bool exists;
        address manufacturer;
        string productName;
        bool compromised;
        Stage currentStage;
    }

    mapping(string => Batch) private _batches;
    mapping(string => Handoff[]) private _history;

    event BatchRegistered(string indexed batchId, address indexed manufacturer, string productName);
    event CustodyTransferred(string indexed batchId, Stage stage, address indexed actor);
    event BatchCompromised(string indexed batchId, Stage stage, address indexed actor);

    error BatchAlreadyExists(string batchId);
    error BatchNotFound(string batchId);
    error InvalidStageTransition(Stage expected, Stage got);
    error ChainComplete(string batchId);

    /// @notice Register a new batch at the Production stage (B1, B2, B3).
    /// @param batchId Unique identifier for the batch.
    /// @param productName Human-readable product/medicine name.
    /// @param details Stage-specific metadata, packed by the caller (e.g. JSON).
    /// @param coldChainOk False marks the batch compromised from the start.
    function registerBatch(
        string calldata batchId,
        string calldata productName,
        string calldata details,
        bool coldChainOk
    ) external {
        if (_batches[batchId].exists) revert BatchAlreadyExists(batchId);

        Batch storage b = _batches[batchId];
        b.exists = true;
        b.manufacturer = msg.sender;
        b.productName = productName;
        b.currentStage = Stage.Production;

        _history[batchId].push(
            Handoff({
                stage: Stage.Production,
                actor: msg.sender,
                timestamp: uint64(block.timestamp),
                details: details,
                coldChainOk: coldChainOk
            })
        );

        emit BatchRegistered(batchId, msg.sender, productName);
        emit CustodyTransferred(batchId, Stage.Production, msg.sender);

        if (!coldChainOk) {
            b.compromised = true;
            emit BatchCompromised(batchId, Stage.Production, msg.sender);
        }
    }

    /// @notice Append the next sequential custody handoff (B4, B5, B6, B7, B8).
    /// @param batchId The batch being transferred.
    /// @param stage Must be exactly the stage after the batch's current one.
    /// @param details Stage-specific metadata, packed by the caller.
    /// @param coldChainOk False marks the batch compromised.
    function transferCustody(
        string calldata batchId,
        Stage stage,
        string calldata details,
        bool coldChainOk
    ) external {
        Batch storage b = _batches[batchId];
        if (!b.exists) revert BatchNotFound(batchId);
        if (b.currentStage == Stage.FinalDelivery) revert ChainComplete(batchId);

        Stage expected = Stage(uint8(b.currentStage) + 1);
        if (stage != expected) revert InvalidStageTransition(expected, stage);

        b.currentStage = stage;

        _history[batchId].push(
            Handoff({
                stage: stage,
                actor: msg.sender,
                timestamp: uint64(block.timestamp),
                details: details,
                coldChainOk: coldChainOk
            })
        );

        emit CustodyTransferred(batchId, stage, msg.sender);

        if (!coldChainOk) {
            b.compromised = true;
            emit BatchCompromised(batchId, stage, msg.sender);
        }
    }

    /// @notice Verify a batch's authenticity and cold-chain integrity (B9, B10, B11).
    /// @return exists Whether the batch was ever registered.
    /// @return authentic True only when the batch exists and is not compromised.
    /// @return compromised True once any handoff reported a cold-chain breach.
    /// @return currentStage The batch's latest stage (Production for unknown batches).
    /// @return manufacturer The address that registered the batch (zero if unknown).
    function verifyBatch(string calldata batchId)
        external
        view
        returns (
            bool exists,
            bool authentic,
            bool compromised,
            Stage currentStage,
            address manufacturer
        )
    {
        Batch storage b = _batches[batchId];
        exists = b.exists;
        compromised = b.compromised;
        authentic = b.exists && !b.compromised;
        currentStage = b.currentStage;
        manufacturer = b.manufacturer;
    }

    /// @notice Return every handoff for a batch in chronological order (B12, B13).
    /// @return The batch's handoffs; empty for an unknown batchId.
    function getBatchHistory(string calldata batchId)
        external
        view
        returns (Handoff[] memory)
    {
        return _history[batchId];
    }
}
