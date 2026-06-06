# Project Proposals — Monad Blitz Medellín

> Tailored for: **experienced full-stack + Solidity team**, interests in **consumer/social/games, AI agents, tooling, IoT**, goal = **win the audience vote**.
>
> Updated with verified research (2026-06-01). Source: `docs/wiki/summaries/monad-blitz-medellin.md` + `docs/wiki/summaries/monad-ecosystem.md`.

## Event at a glance

| | |
|---|---|
| **Date** | June 6, 2026 |
| **Venue** | Indie Universe Hotel, Medellín |
| **Hacking window** | 11:00 AM → 6:00 PM (code freeze) — **7 hours total, ~5 effective** (reserve the last hour for demo prep + dry-runs) |
| **Demos** | 7:00–9:00 PM |
| **Winners** | 10:00 PM |
| **Judging** | Live audience vote — cash prizes |
| **Prizes** | 🥇 **$1,000** · 🥈 **$700** · 🥉 **$300** |
| **Included** | WiFi, meals, snacks, swag, technical mentors |

**What "audience vote" means:** the crowd votes for what *engaged them*, not what was technically impressive. A demo where the audience participates (QR → their phones → something happens on screen) wins. Demos run 7–9pm — votes happen after everyone has seen all teams. The **last team to demo** may benefit from recency bias; the team that **got people's phones in hand** benefits most.

## The selection principle

*Every idea must be understandable in 10 seconds, demoable in 90, and visibly impossible on a normal chain.* Monad's ~400 ms blocks and near-zero gas are the star — make the audience **feel** it.

## How these are scored

| Lever | Why it wins |
|---|---|
| **Instant "wow"** | The crowd gets it without explanation. |
| **Everyone can try it live** | QR on screen → room plays on phones (embedded wallet + gas sponsorship, no install). |
| **Speed made visible** | Counters, pixels, agents updating in real time — Monad's TPS as spectacle. |
| **Local flavor** | A Medellín / Colombia angle earns a hometown cheer. |
| **A single memorable moment** | One screenshot-able climax the audience remembers when voting. |

## Before you build: the non-negotiable setup

Every proposal using embedded wallets + gas sponsorship (all except #3 ChainBeat) requires:

1. **Privy account** — create app, enable "Automatically create embedded wallets on login" → EVM Wallets, save App ID.
2. **Pimlico account** — API Keys → RPC URLs → select "Monad Testnet" → copy bundler URL.
3. **⚠️ Pimlico free-tier limits are unknown.** With 50–100 audience wallets transacting live, you may hit a cap mid-demo. Check Pimlico pricing before the event and upgrade if needed; or gate sponsorship to one sponsored tx per session.
4. **Production HTTPS required for PWA.** Embedded wallet + gas sponsorship work on localhost for dev, but the full PWA install prompt and push notifications need HTTPS. Deploy to Vercel or use ngrok before the demo. Test on a real phone via the production URL.
5. **RPC:** always `https://testnet-rpc.monad.xyz`. The `rpc.testnet.monad.xyz` variant does not resolve (verified dead). Use a paid Alchemy/QuickNode key as backup — the public RPC rate-limits under crowd.
6. **Fund wallets the night before** from `https://faucet.monad.xyz` (faucet rate-limits from server IPs; drip from your personal browser; ~0.2 MON/day, deploy costs ~0.011 MON).

---

## 1. 🎨 MonadCanvas — live on-chain pixel war ⭐ top pick
**Category:** Consumer / Game | **Complexity:** Medium | **Build time:** ~4 h contract + frontend, ~1 h polish

**Pitch:** An r/place-style shared pixel canvas where **every pixel placement is an on-chain transaction**, confirmed in ~400 ms and rendered live for the whole room. QR on the projector → the audience floods the canvas from their phones during the demo.

**Why Monad:** 1 pixel = 1 tx. A packed room placing pixels = hundreds of tx/min settling instantly and basically free. Literally impossible to demo on Ethereum L1, laggy/expensive on most L2s. It's the purest visual proof of Monad's throughput.

**Why it wins the vote:** the audience *is* the demo. They see their own pixels appear in real time on the big screen. Maximum engagement, zero explanation needed. End by spelling "MONAD" or the Medellín skyline as a crowd.

**Stack:**
- **Template:** `github.com/monad-developers/next-serwist-privy-smart-wallet` (Next.js PWA + Privy embedded wallet + Pimlico gas sponsorship — users need no MON, no MetaMask).
- **Contract:** `setPixel(x,y,color)` writing a packed `uint256` `mapping(uint256 => uint256)`, one event emitted per write. ~30–50 lines of Solidity.
- **Live updates:** WebSocket `eth_subscribe(logs)` on the contract address → update canvas in real time. Fall back to 1-second polling if venue firewall blocks WS.
- **Deploy:** `npx hardhat ignition deploy --network monadTestnet`.

**One-day MVP:** fixed-size grid (100×100), 16-color palette, one tx per pixel, live canvas render, QR code on projector.

**Stretch:** cooldown per wallet, pixel ownership display, tx/sec heatmap, leaderboard of top painters, mint the final canvas as an NFT.

**Demo (90s):**
> "This is a shared canvas. Every dot you place is a real blockchain transaction, confirmed in 400 milliseconds. Scan this — everyone, start painting." *(room floods the canvas)* "That's Monad — near-zero fees, live on testnet. Each of those pixels is a real on-chain transaction."

**Risks:**

| Risk | Mitigation |
|---|---|
| Public RPC rate-limits under crowd | Paid backup RPC key ready in `.env.local` (Alchemy/QuickNode) |
| Pimlico free-tier cap mid-demo | Check Pimlico pricing before event; upgrade or gate to 1 tx/session |
| WS blocked by venue firewall | Fall back to 1-second short-poll |
| Deploy fails on the day | Run full preflight with funded key the night before |

---

## 2. 🤖 Agent Arena — autonomous AI agents competing on-chain ⭐ strong contender
**Category:** AI agents / Game | **Complexity:** Medium-High | **Build time:** ~5 h (budget the full sprint)

**Pitch:** A live arena where several **AI agents trade/battle against each other on-chain in real time**, each move a Monad transaction, visualized as a race that updates every block. The audience picks a side and watches it play out.

**Why Monad:** agents act far faster than humans — high tx frequency settled sub-second is Monad's sweet spot. Direct nod to the **Moltiverse** AI-agent theme ($200K hackathon built on this exact idea).

**Why it wins the vote:** AI + crypto + live competition is the current zeitgeist. A real-time "who's winning" scoreboard is gripping. Let the audience bet on a side → they're invested in the outcome.

**Stack:**
- **Template:** start bare (`github.com/monad-developers/hardhat-monad`) for the contract; plain Next.js for the dashboard.
- **Agent loop:** off-chain Node.js process: `strategy() → signTx → broadcast via ethers`. Use `github.com/monad-developers/monad-mcp-tutorial` as the pattern for giving an LLM read/write access to Monad.
- **Contract:** simple on-chain game — e.g. a price-prediction market or competitive "mining" contract where each agent submits a move. Rules-based agents as the reliable core; LLM as a flavor layer.
- **Live view:** WebSocket log subscription → scoreboard updates per block.

**One-day MVP:** 3 pre-funded rule-based agents playing a competitive on-chain game in a loop. Live scoreboard. Audience picks who wins before the match ends.

**Stretch:** audience-spawned agents with a one-line prompt ("be aggressive"), agent-vs-human mode, token launch per agent, LLM strategy commentary.

**Demo (90s):**
> "These three AIs are trading against each other — live, on-chain, right now. Every move is a Monad transaction. Pick your winner." *(narrate the race to the finish)*.

**Risks:**

| Risk | Mitigation |
|---|---|
| LLM latency breaks real-time feel | Rules-based agents are the MVP; LLM is stretch |
| LLM non-determinism / bad moves | Cap the worst-case move; add guardrails |
| Agent wallets run out of MON | Pre-fund 5+ wallets each with 0.1 MON the night before |
| Not enough time to build UI + agents | Build agents first; dashboard is a bar chart + scoreboard |

**Note:** no embedded wallet / Pimlico needed unless you add audience participation (agent spawning). That makes this proposal lower dependency risk than most others.

---

## 3. 📡 ChainBeat — real-time Monad network visualizer
**Category:** Tooling / Infra | **Complexity:** Low-Medium | **Build time:** ~3–4 h

**Pitch:** A beautiful, full-screen, live visualization of Monad itself — transactions raining in, blocks landing every ~400 ms, a TPS gauge pulsing. A public-good "heartbeat of Monad" (in the spirit of *Last Monad*, a past Blitz winner).

**Why Monad:** the chain's defining trait *is* the visual — a firehose of txs a slow chain could never produce. The medium is the message.

**Why it wins the vote:** gorgeous motion graphics read instantly from the back of the room and double as ambient hype for the *whole event*. Judges remember the one that looked stunning on the projector.

**Stack:**
- **No contract required** (or a tiny "leave your mark" contract for audience interactivity).
- **Data:** WebSocket `eth_subscribe(newHeads)` + `eth_subscribe(logs)` on the public RPC, or Envio HyperIndex for richer tx data.
- **Viz:** React + D3 / three.js / canvas particles. No Privy or Pimlico needed — lowest external-dependency risk of any proposal.

**One-day MVP:** live block feed, animated tx particles per block, TPS counter, gas price ticker. Smooth and beautiful at 60fps on a projector.

**Stretch:** click a tx to inspect it, "biggest tx of the last minute," geographic node map, embeddable widget the Monad team could actually reuse.

**Demo (90s):**
> "This is Monad, right now. Every particle is a real transaction. Blocks land every 400 milliseconds." *(let it run)*. "Add a 'tap to send a tx and watch it appear' hook so the audience feels it."

**Risks:**

| Risk | Mitigation |
|---|---|
| Lower interactivity → harder to make participatory | Add a "tap to send a tiny tx and watch your particle appear" hook using embedded wallet |
| Public RPC rate-limits WebSocket under load | Use Envio or a hosted RPC with higher WS limits |

**Advantage:** **no Privy, no Pimlico, no gas sponsorship complexity.** Lowest dependency risk in the list. If you're short on time or hit blockers on another proposal, pivot here.

---

## 4. 🔘 TapMint — physical NFC tap mints on-chain ⭐ differentiator
**Category:** IoT / Consumer | **Complexity:** Low (NFC-tag route) / Medium-High (ESP32) | **Build time:** ~3 h (NFC path)

**Pitch:** A physical device on stage — an NFC tag or button — that when tapped mints a "Proof-of-Presence at Monad Blitz Medellín" NFT in under half a second. A live wall on the projector shows every attendee who's tapped, count ticking up.

**Why Monad:** sub-second confirmation makes a *physical* interaction feel native — tap and it's done before you look up. Micro-fees make per-tap economics viable.

**Why it wins the vote:** **almost nobody else will bring hardware.** A tangible object judges can touch is uniquely memorable at a software-heavy event. Tap → instant confirmation → crowd reacts. Hand the device to a judge on stage.

**Recommended primary path — NFC tag (bulletproof):**
- NFC tags (≈$0.50 each, order now) encode a URL pointing to a deployed Privy PWA.
- Tap → browser opens → embedded wallet created invisibly → Pimlico sponsors the mint tx → NFT mints in ~400 ms.
- Zero firmware, zero serial port debugging. The "hardware" is just a sticker.
- Paste tags on a card, on a wall, on a physical prop — anything you want audience to tap.

**Optional cooler path — ESP32 / Raspberry Pi:**
- Device watches a button GPIO → calls a backend relay → relay signs + broadcasts to Monad.
- Visually dramatic (a real button light-up), but adds firmware + hardware debugging risk on the day.
- Only commit to this if you've fully tested it at home, on venue-equivalent Wi-Fi, before June 6.

**Template:** `github.com/monad-developers/next-serwist-privy-smart-wallet` for the tap-landing PWA.

**One-day MVP:** ERC-721 mint contract, NFC tag → Privy PWA → Pimlico-sponsored mint, live wall of minted NFTs on projector with running count.

**Stretch:** sensor data on-chain (temperature, motion from ESP32), pay-per-use unlock (door opens when payment confirms), physical "applause meter" tallying taps as votes.

**Demo (90s):**
> "Watch — tap this." *(NFT mints on screen in <0.5s)*. "Real hardware. Real chain. 400 milliseconds. Now — everyone come tap the wall before the vote." Hand a tag to a judge.

**Risks:**

| Risk | Mitigation |
|---|---|
| ESP32 firmware debugging eats the whole sprint | **Use NFC-tag-URL path as the primary build.** ESP32 is stretch if time permits. |
| Venue Wi-Fi blocks tag URL domain | Test the URL on a hotspot as backup; pre-test on venue Wi-Fi on arrival |
| Privy embedded wallet slow on first login | Warm up a session before demo; show a pre-loaded phone as the "first tap" |
| Pimlico free-tier cap | Same as #1 — check and upgrade beforehand |

**Setup note:** NFC tags need to be ordered *now* and arrive before June 6. Standard NTAG215 tags work. Write the URL with any NFC-writing app.

---

## 5. 🎰 Medellín Live Markets — real-time prediction market on the event itself ⭐ crowd magnet
**Category:** Consumer / DeFi-lite | **Complexity:** Medium | **Build time:** ~4–5 h

**Pitch:** A real-time play-money prediction market where the audience bets (testnet MON, via sponsored gas) on **what's happening in the room** — "Which team wins the Blitz?", "Will the next demo work live?", "Will it rain in Medellín tonight?" Odds shift in real time as the room piles in.

**Why Monad:** bet placement and odds recompute every block — a market that feels like a live exchange, not a slow on-chain vote.

**Why it wins the vote:** **meta and hilarious** — the audience bets on the hackathon *while at the hackathon*, including on the other demos. You can open a market on the audience vote itself. Pure engagement.

**Stack:**
- **Template:** `github.com/monad-developers/next-serwist-privy-smart-wallet`.
- **Contract:** simple parimutuel contract (`createMarket`, `bet(marketId, outcome)`, `resolve(marketId, outcome)`) — ~80 lines Solidity. Manual resolution (you call `resolve()` during the demo).
- **Live odds:** recalculate pool ratios client-side from events; WebSocket update.

**One-day MVP:** 2–3 binary markets active during the demo, live pooled odds, one live resolution with a payout moment.

**Key markets to open:**
- "Which team wins the Blitz?" (open during demos 7–9pm)
- "Will this demo's live transaction confirm before I finish this sentence?" (open mid-demo as a stunt)
- Nacional vs. Medellín next match, or local weather — hometown angle.

**Stretch:** automated oracle resolution, multi-outcome markets, leaderboard of sharpest bettors.

**Demo (90s):**
> "Open your phone — bet on which demo today wins the crowd. Watch the odds shift as you do." *(live bar updates)*. "Now — let's resolve the 'will the next tx confirm in 1 second' market." *(send tx, watch it confirm)* "Pay out."

**Risks:**

| Risk | Mitigation |
|---|---|
| "Gambling" optics | Frame as forecasting/prediction; testnet-only play money; never mention "gambling" |
| Resolution requires trust (you control `resolve()`) | Be explicit: "we're the oracle for now" — it's a demo, not prod |
| Pimlico free-tier cap | Same as #1 |
| Complex contract ships buggy | Keep it parimutuel (simpler math than AMM); test manually before event |

**Timing note:** given demos are 7–9pm and winners at 10pm, you can open a "who wins?" market during the demo window itself — the audience places bets while watching other teams. Maximum engagement.

---

## 6. 💸 PropinaYA — instant streaming tips for street artists
**Category:** Consumer / Payments / Local flavor | **Complexity:** Medium | **Build time:** ~4–5 h

**Pitch:** Scan a QR sticker on a busker or guide and **stream micro-tips per second** in MON while you enjoy the act. Money flows in real time and stops when you close the tab. A Medellín-flavored consumer payments story.

**Why Monad:** per-second streaming = many tiny txs per minute; near-zero fees + 400 ms blocks make micropayment streaming actually practical instead of theoretical.

**Why it wins the vote:** relatable, warm, **deeply local** story. Medellín has a rich street-arts culture; judges from the Medellín Blockchain Community will recognize it immediately. "I'd actually use this" is a real reaction.

**Stack:**
- **Template:** `github.com/monad-developers/next-serwist-privy-smart-wallet`.
- **Contract:** deposit-then-stream (recipient calls `claim()` for accrued balance, or streamer calls `stopStream()`). Or: a simple batched micro-tx loop from the client (1 tx/sec). The batched-tx approach is simpler to build.
- **Demo props:** a printed QR sticker and a second phone showing the "artist dashboard" (rising balance in real time).

**One-day MVP:** one payer streams to one recipient; two-screen demo — payer's phone and recipient's dashboard both visible.

**Stretch:** multiple tippers to one artist, split tips among a group, fiat-display via price feed, "tip leaderboard," physical QR stickers to hand out to audience.

**Demo (90s):**
> "Imagine this: a busker is playing in Parque Lleras. You scan their QR — and you tip them per second, live on the blockchain." *(show both screens)*. "Every second, a transaction. Sub-cent fees. 400 ms confirmation. Stop watching — stream stops." *(QR to audience)* "Someone else, co-tip them."

**Risks:**

| Risk | Mitigation |
|---|---|
| "Streaming" is simulated micro-txs (not a single stream) | Be transparent: "one tx per second" is fine — Monad makes this viable, that's the point |
| Lower wow factor vs. Canvas/TapMint | The local story compensates; pair with a live 2-screen setup |
| Pimlico cap with many audience tippers | Gate sponsorship or keep demo to 2–3 phones |

---

## 7. 🕹️ TapWar / MonadClicker — massively-multiplayer on-chain clicker (safest fallback)
**Category:** Consumer / Game | **Complexity:** Low | **Build time:** ~2–3 h contract + frontend

**Pitch:** The room splits into two teams. Every tap on your phone is an on-chain transaction incrementing your team's counter. Live bar race plays out on the projector. Lowest-risk build in the list.

**Why Monad:** thousands of taps = thousands of txs in minutes, settling instantly — a live TPS stress test the audience drives themselves.

**Why it wins the vote:** dead-simple, competitive, loud, fun. "Team A vs Team B, tap to win" needs zero explanation and creates a chant-worthy finish.

**Stack:**
- **Template:** `github.com/monad-developers/next-serwist-privy-smart-wallet` (same as MonadCanvas — ~80% shared).
- **Contract:** `tap(uint8 team)` increments `teamCount[team]`, emits `Tapped(address, team)`. ~20 lines.
- **Frontend:** two bar charts + a countdown timer + winner modal. Live update via WebSocket log events.
- **No new patterns needed** beyond what preflight-test already proves.

**One-day MVP:** 2 teams, tap button, live bar race, countdown, winner screen with the winning team's count.

**Stretch:** per-user tap leaderboard, power-ups (send 5 taps at once), combo with TapMint NFC button (#4) as a physical tap input, "total Monad taps ever" counter.

**Demo (90s):**
> "Left side of the room — you're Team Blue. Right side — Team Red. Tap to win. Go." *(room erupts, bar race plays out)*. "Photo finish — in X minutes, N,000 transactions, confirmed, on Monad."

**Risks:**

| Risk | Mitigation |
|---|---|
| Feels gimmicky as the only feature | Lean into the competition narrative; add a clean winner moment with crowd reaction |
| Pimlico cap mid-game | Same mitigation as #1 |

**Why it's in the list:** it shares ~80% of MonadCanvas's stack (same contract pattern, same embedded wallet, same WebSocket events, same projector view). A pivot from Canvas to TapWar mid-day costs ~2 hours, not a full restart. It's the escape hatch if Canvas runs into trouble.

---

## Recommendation (for "win the $1,000 first prize")

| Rank | Project | Why |
|---|---|---|
| 🥇 | **#1 MonadCanvas** | Highest ceiling: participatory, beautiful, *the room makes the demo*, clearest proof of Monad's speed. Fits comfortably in 5 hours with the template. |
| 🥈 | **#4 TapMint (NFC path)** | Your unfair advantage — almost nobody brings hardware. NFC-tag route is low-risk and buildable in ~3 hours, leaving time for polish. |
| 🥉 | **#2 Agent Arena** | Rides the Moltiverse AI-agent wave; gripping live-competition narrative; no Pimlico dependency = one fewer day-of risk. |
| ▶ | **#5 Live Markets** | Most meta engagement; pairs brilliantly as a *side bet* on any other team's demo during the 7–9pm window. |
| ▶ | **#7 TapWar** | Safest fallback / time-buffer build; or the headline mini-game embedded inside Canvas. |

**Strategy if you want to hedge:** build **#1 (Canvas)** as the hero, keep **#7 (TapWar)** as a fallback — they share ~80% of the stack. If Canvas hits trouble by 3pm, a pivot to TapWar costs ~2 hours. If you want the differentiator, commit to **#4 (NFC TapMint)** early: order NFC tags now, build the landing PWA from the privy-smart-wallet template, and arrive with it tested.

**Combo play (high risk / high reward):** Canvas (#1) + a physical NFC tag (#4) where tapping the tag places a pixel. Software spectacle *and* a tangible prop on stage. One memorable stage moment the audience tweets.

**Pre-event reminder:** every proposal using Privy + Pimlico requires you to create accounts, configure env vars, and (critically) **verify Pimlico's free-tier limits** before the day. Don't discover a sponsorship cap when 60 people are trying to paint pixels live. See `docs/wiki/gotchas.md` and `docs/wiki/todos.md` for the full checklist.

See [`monad-dev-guide.md`](./monad-dev-guide.md) for network config and templates, and [`README.md`](./README.md) for the full day-of plan.
