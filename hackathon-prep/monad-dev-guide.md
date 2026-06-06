# Monad Dev Guide — Build & Deploy in a Day

> Quick-reference for **Monad Blitz Medellín** (one-day IRL hackathon, Monad testnet, demos judged by **live audience vote**).
> Verify live values at **https://docs.monad.xyz** and **https://developers.monad.xyz** on the day — testnet endpoints change.

---

## 1. What Monad is (and why it matters for your demo)

- **Fully EVM-compatible, parallel-execution L1.** Your existing Solidity contracts and tooling (Foundry / Hardhat / Remix / Scaffold-ETH / viem / wagmi / ethers) work unchanged — just point the RPC at Monad.
- **Performance:** marketed at **~10,000 TPS, ~400 ms block times**, gas fees a tiny fraction of a cent on testnet.
- **The hackathon takeaway:** the winning demos *show* this speed. Build things that would feel laggy or impossibly expensive on a normal chain — every user action is a transaction, settled in under half a second, live on a screen. That visceral "it's instant" moment is what wins an audience vote.

## 2. Network configuration (Monad testnet)

> ✅ **Verified live on 2026-06-01** (via the `preflight-test/` script in this folder): RPC returned chain ID `0x279f` = `10143`, current block ~35.5M, gas price ~102 gwei. A contract deploy costs ~**0.011 MON**.

| Field | Value | Status |
|---|---|---|
| **Chain ID** | `10143` | ✅ verified |
| **RPC URL** | `https://testnet-rpc.monad.xyz` | ✅ verified working |
| ~~`https://rpc.testnet.monad.xyz`~~ | **dead — does not resolve, do not use** | ❌ verified broken |
| **Currency symbol** | `MON` | — |
| **Block explorer** | `https://testnet.monadscan.com` (alternatives: MonadVision, BlockVision) | ✅ HTTP 200 |
| **Faucet** | `https://faucet.monad.xyz` (and ETHGlobal: `https://ethglobal.com/faucet/monad-testnet-10143`) | ⚠️ live but rate-limits (429) |

> ⚠️ **Confirm again the morning of the event** — testnet RPC hosts rotate. Chain ID `10143` is stable. The **faucet rate-limits aggressively** (we hit HTTP 429) — use it from your own browser/wallet and fund early. Have a **hosted RPC key** (Alchemy, QuickNode, Ankr, thirdweb) as backup; the public RPC will throttle under a room full of hackers.

### Add to MetaMask (one-click)
Use the "Add to wallet" button on the Monad developer portal, or add the network manually with the values above. Then request MON from the faucet (≈0.2 MON/day — enough for hundreds of testnet txs given near-zero gas).

## 3. Pick your stack

| Tool | Best for | Repo / start |
|---|---|---|
| **Foundry** | Fast contract dev/test/deploy, Solidity-native team | `github.com/monad-developers/foundry-monad` (pre-configured template) |
| **Hardhat** | JS/TS teams, Ignition deploys | `github.com/monad-developers/hardhat-monad` |
| **Scaffold-ETH (Monad)** | Full-stack dApp fast — contracts + Next.js frontend wired together | `github.com/monad-developers/scaffold-monad-hardhat` |
| **Remix** | Zero-setup quick deploy in the browser | remix.ethereum.org → point injected provider at Monad |

**Recommendation for an experienced team optimizing for a demo:** start from **Scaffold-ETH (Monad)** or one of the **Next.js + embedded-wallet templates** below. You get a deployable contract and a working frontend in minutes, so all your time goes into the *wow*, not boilerplate.

> 🧰 **Local environment check (this machine, 2026-06-01):** `node v25.2.1`, `npm 11.6.2`, `git 2.42` ✅ — but **Foundry (`forge`/`cast`) is NOT installed**. On Windows the frictionless path is the **Hardhat / ethers / Scaffold-ETH** stack (no WSL needed). If you want Foundry, install via `foundryup` (needs WSL or the Windows build) — budget time for it *before* the event, not during. The `preflight-test/` folder in this repo already proves the Node+ethers+solc path compiles and deploys.

### Deploy commands (cheat sheet)
```bash
# Foundry
forge create src/MyContract.sol:MyContract \
  --rpc-url https://testnet-rpc.monad.xyz \
  --private-key $PRIVATE_KEY --broadcast
# (or run a deploy script with --chain-id 10143)

# Hardhat (Ignition)
npx hardhat ignition deploy ignition/modules/MyModule.ts --network monadTestnet
```

## 4. Frictionless onboarding = audience-vote superpower

The single biggest lever for an audience vote: **let everyone in the room use your app on their phone in 5 seconds, with no wallet install and no gas prompt.** Monad's official templates already wire this up:

- **Embedded wallets** — `next-serwist-privy-embedded-wallet`, `next-serwist-thirdweb` (login with email/social, wallet created invisibly).
- **Gas sponsorship / account abstraction** — `next-serwist-privy-smart-wallet` (Pimlico paymaster), `react-native-privy-pimlico-gas-sponsorship-template`. Users transact without ever holding MON.
- **Farcaster mini-apps** — `monad-miniapp-template` (Next.js mini-app that runs inside Farcaster — instant social distribution).
- **Mobile** — `expo-thirdweb-example`, `expo-swap-template`, `react-native-privy-embedded-wallet-template`.
- **0x swap integration** — `next-serwist-privy-0x`, `expo-swap-template` (drop-in token swaps).
- **AI / agents** — `monad-mcp-tutorial` (Model Context Protocol server that lets an LLM read/act on Monad testnet).

All of these live under **`github.com/monad-developers`**. Clone the closest match and reskin it.

## 5. Example / reference projects (what's been built on Monad)

From prior Monad hackathons (Blitz series + MetaMask Smart Accounts x Monad) — useful as patterns to remix, not to copy:

- **TradeClub** — automated on-chain execution via smart accounts; intent-based triggers + automated flows powered by indexing.
- **ShieldAI** — on-chain monitoring *agent* reacting to Monad events in real time, detecting anomalous contract interactions.
- **Smart Account Explorer** — clean UI to inspect smart-account activity.
- **Last Monad** — live network dashboard showcasing Monad activity in real time (great example of a "speed as spectacle" tooling demo).
- **Moltiverse ($200K) theme** — autonomous AI agents executing transactions on Monad: world-model agents, agent-to-agent commerce, gaming/wagering, robotics/hardware. (Directly relevant to your AI-agent and IoT interests.)

## 6. Indexing & reading on-chain data fast

For dashboards / real-time UIs, raw RPC polling won't keep up with Monad's pace. Options:
- **Envio** (HyperIndex) — fast Monad indexer, used by winning projects for real-time data.
- **WebSocket `eth_subscribe`** on the RPC for live blocks/logs.
- **The Graph / Goldsky / Ponder**-style indexers where supported.

## 7. Gotchas to pre-empt (so you don't lose hack-hours)

- **Public RPC will rate-limit** under load. Have an **Alchemy/QuickNode/thirdweb key as backup** ready before the event.
- **Faucet limits** (~0.2 MON/day). Drip funds to your deployer wallet **the night before**, and have a second funded wallet.
- **Confirm RPC + explorer URLs on the morning of** — don't hardcode last year's endpoints.
- **Don't over-scope the contract.** Audience votes reward the *visible* experience. A 30-line contract with a beautiful, fast frontend beats a clever 300-line contract nobody can see working.
- **Demo on the venue Wi-Fi early** — test latency to the RPC from the actual network before you're on stage.
- **Have a fallback recording** of the demo working, in case the network or projector fails live.

---

### Wiki cross-references
This guide is a human-readable quickstart. The wiki pages that own these facts (and will stay updated) are:
- [[entities/monad-network]] — verified network config + deploy commands
- [[summaries/monad-ecosystem]] — full tooling and template research
- [[architecture]] — chosen stack + Privy/Pimlico setup steps
- [[gotchas]] — dead RPC URL, faucet rate-limiting, PWA prod-only, Pimlico limits

### Sources
- [Monad — The Most Performant EVM Blockchain](https://www.monad.xyz/)
- [Monad Developer Portal](https://developers.monad.xyz/)
- [Monad Documentation — Network Information](https://docs.monad.xyz/developer-essentials/network-information)
- [Deploy a smart contract (Foundry)](https://docs.monad.xyz/guides/deploy-smart-contract/foundry) · [(Hardhat)](https://docs.monad.xyz/guides/deploy-smart-contract/hardhat)
- [foundry-monad template](https://github.com/monad-developers/foundry-monad) · [scaffold-monad-hardhat](https://github.com/monad-developers/scaffold-monad-hardhat) · [monad-miniapp-template](https://github.com/monad-developers) · [monad-mcp-tutorial](https://github.com/monad-developers)
- [Monad Testnet RPC settings — Chainlist](https://chainlist.org/chain/10143) · [thirdweb Monad testnet](https://thirdweb.com/monad-testnet)
- [MetaMask Smart Accounts x Monad Hackathon Winners — Envio](https://docs.envio.dev/blog/metamask-smart-accounts-hackathon-winners)
- [Monad: The Home For Builders](https://blog.monad.xyz/blog/home-for-builders)
