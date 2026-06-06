# Monad Blitz Medellín — Prep Kit & Workflow

Everything to walk in ready to build and walk out with the audience vote.

- 📄 [`monad-dev-guide.md`](./monad-dev-guide.md) — how to build/deploy on Monad, tooling, templates, network config, example projects.
- 💡 [`project-proposals.md`](./project-proposals.md) — 7 tailored project ideas, ranked for an audience vote.
- 🗺️ This file — the prep workflow (before / during / demo).

---

## The event in one paragraph

**Monad Blitz Medellín** is a **one-day, in-person hackathon** (hosted by the Medellín Blockchain Community, Monad Foundation, and DevLabX3). Format: morning workshops on Monad's architecture and dev tools → a build sprint where solo builders or small teams ship a working prototype (consumer apps favored) on **Monad testnet** → demos to the room, **winners chosen by live audience vote** with cash prizes. Registration requires verifying token ownership with your wallet.

**What that means for strategy:** the bar is a *deployed, working, immediately-understandable demo*, not technical depth. Optimize for a clear live moment the room can see and ideally participate in. (Details: [Luma event page](https://luma.com/o56ekpyb).)

---

## Phase 0 — This week (before the event)

- [ ] **Register & verify wallet** on the [Luma page](https://luma.com/o56ekpyb) (requires token-ownership verification — don't leave this to the morning of).
- [ ] **Confirm logistics:** exact address, start time, what to bring (the address is revealed after registration). Bring chargers, a power strip, an HDMI/USB-C-to-projector adapter, and a phone for testing.
- [ ] **Lock the team & roles** (see below).
- [ ] **Skim** [`monad-dev-guide.md`](./monad-dev-guide.md) and shortlist **2 ideas** from [`project-proposals.md`](./project-proposals.md): a hero and a fallback that share a stack.
- [ ] **If doing the IoT idea (#4):** order/charge the hardware (NFC tags, ESP32/RPi, cables) now and test it end-to-end at home — hardware is the long pole.

## Phase 1 — Night before (the setup that saves your morning)

Do a full dry run so day-of you only write feature code, not config:

> ✅ **Already verified for you on 2026-06-01** (see [`preflight-test/`](./preflight-test/)): the live RPC is **`https://testnet-rpc.monad.xyz`** (chain ID `10143`); the `rpc.testnet.monad.xyz` variant is **dead — don't use it**. Solidity compiles, RPC is reachable, and a deploy tx is chain-accepted (~0.011 MON per deploy). The only unverified step is the funded on-chain deploy — that needs *your* faucet key.

- [ ] **Run the pre-flight test:** `npm install --prefix hackathon-prep/preflight-test` then `node hackathon-prep/preflight-test/preflight.mjs`. It should pass every check up to funding. Then fund a wallet and re-run with `$env:DEPLOYER_PK="<funded key>"` to confirm the **real deploy + read-back** end-to-end.
- [ ] **Wallet:** add Monad testnet to MetaMask (Chain ID `10143`, RPC `https://testnet-rpc.monad.xyz`). Re-confirm at [docs.monad.xyz](https://docs.monad.xyz) the morning of.
- [ ] **Fund deployer wallet(s)** from the [faucet](https://faucet.monad.xyz) (drip the night before; ~0.2 MON/day, and it **rate-limits — 429s** under load, so do it early). Fund **two** wallets.
- [ ] **Backup RPC key** ready (Alchemy / QuickNode / thirdweb) — the public RPC *will* rate-limit in a room of hackers.
- [ ] **Clone & run a template** so it builds clean on your machine:
  - Full-stack: `github.com/monad-developers/scaffold-monad-hardhat`
  - Frictionless onboarding: `next-serwist-privy-embedded-wallet` (+ `-smart-wallet` for sponsored gas)
  - Mini-app: `monad-miniapp-template` · AI: `monad-mcp-tutorial`
  - *(Foundry is **not** installed on this machine — Hardhat/Scaffold-ETH is the no-friction Windows path. Install `foundryup` ahead of time only if you specifically want Foundry.)*
- [ ] **Set up the repo, env vars, and CI of nothing** (just `git init` + push) so you're not fighting tooling on the clock.
- [ ] **Pre-write the contract skeleton** for your hero idea (it's tiny — see the proposal; `preflight-test/Counter.sol` is a working starting point). Don't deploy the real one yet, but have it ready.

## Phase 2 — Day-of: build sprint (suggested timeline for a ~6–7h hack window)

| Time | Focus |
|---|---|
| **Workshops** | Attend — they cover Monad tooling and often reveal judging hints, available SDKs, and what the team wants to see. Note anything that de-risks your build. |
| **First 30 min** | **Lock the idea** (use the decision checklist below). Confirm the demo moment. Assign roles. Re-confirm RPC/faucet live. |
| **Hour 1** | Deploy the real contract to testnet. Stand up the frontend from the template. Get **one** end-to-end action working (sign → tx → confirmed → UI updates). |
| **Hours 2–4** | Build the core loop. Wire **embedded wallet + sponsored gas** early — onboarding friction is the #1 thing that kills a live audience demo. Get the live/real-time view working. |
| **Hour 5** | **Polish for the projector:** big fonts, high contrast, motion, the live counter/visual. This is where audience-vote points are won. Freeze scope. |
| **Last hour** | **Dry-run the demo 3×.** Test on the **venue Wi-Fi**. Record a backup video. Prepare the QR code and the one-line ask to the audience. |

> **Two-strike rule:** if an approach fails twice, stop, fall back to the simpler sibling idea (e.g. Canvas → TapWar). Shipping a simple thing that works beats a clever thing that doesn't demo.

## Decision checklist — am I building the right thing? (answer in the first 30 min)

1. **Can a stranger understand it in 10 seconds?** If not, simplify.
2. **Is there a live moment the *audience participates in*?** (QR → their phones). If not, add one.
3. **Does it visibly show Monad's speed** (real-time updates, many txs)? If not, why this chain?
4. **Can we ship a working MVP in ~4 hours**, leaving 2h for polish + demo prep? If not, cut scope now.
5. **What's the single screenshot-able climax** the room remembers when voting? Design backward from it.

## Team roles (for a small experienced team)

- **Contracts** — write/deploy the (small) contract, manage deployer wallets & funds, set up the backup RPC.
- **Frontend / demo** — template setup, embedded wallet + gas sponsorship, the live/projector view. *This role owns the win.*
- **Glue / AI / hardware** — indexing/WebSocket feed, AI agent loop (#2), or the IoT device (#4); also runs the dry-runs and records the backup video.
- **Pitcher** — one person owns the 90-second story and the audience call-to-action. Rehearse it out loud.

## Demo-day winning tactics (audience vote)

- **Open with the moment, not the architecture.** Show the thing working in the first 10 seconds.
- **Put a QR on the screen** and get the room using your app — engaged people vote for you.
- **Big, legible, high-contrast visuals.** It's read from across a room on a projector.
- **Name-drop Monad's numbers once** ("~400 ms, near-zero fees") tied to what they're seeing.
- **Local flavor earns cheers** — a Medellín/Colombia angle (#5, #6) resonates with a hometown crowd.
- **End on the climax** (the finished canvas, the photo-finish, the live payout) — then stop. Don't trail off into a roadmap.
- **Have the backup video queued** in case Wi-Fi or the projector fails.

## Pre-flight checklist (carry this on the day)

- [ ] Two funded testnet wallets · backup RPC key in env · faucet confirmed working
- [ ] Template builds clean · hello-world contract already deployed & read back
- [ ] Embedded wallet + gas sponsorship working on a **phone**, not just localhost
- [ ] Live/real-time view renders on an external display (test the projector resolution)
- [ ] QR code generated and tested · 90-second pitch rehearsed 3× · backup video recorded
- [ ] Chargers, power strip, projector adapter, (IoT hardware tested) packed

---

*Built from research on the Monad ecosystem and the Blitz hackathon format — see Sources in [`monad-dev-guide.md`](./monad-dev-guide.md). Re-confirm all live URLs/endpoints on the morning of the event.*
