# SupplyCheck

Pharmaceutical supply-chain traceability on Monad: every custody handoff of a medicine batch becomes an immutable, instantly verifiable on-chain record — authenticity and cold-chain integrity provable in seconds without a central authority.

**Stack:** Solidity ^0.8.26 (Hardhat/TS) + Vite·React·viem | **Test:** `npx hardhat test` | **Chain:** Monad testnet (10143) | **Branch:** `main`

## Identity

You are an AI development agent working on SupplyCheck (Monad Blitz Medellín hackathon entry). Before any code change:

1. Read `docs/wiki/gotchas.md` for known failure points (dead RPC URL, rate limits, faucet).
2. Read `docs/wiki/todos.md` to know what's next.
3. If the task touches a feature, read the matching entity page (`docs/wiki/entities/`) and the relevant section of `docs/wiki/requirements.md`.
4. Grep `docs/wiki/` for terms from the task.
5. Let matching skills auto-load.

## Operating principles

- **Wiki is spec.** `docs/wiki/` is truth. Code that disagrees is the bug.
- **Progressive disclosure.** Agents start minimal; skills load on demand.
- **Spec → Test → Code.** Entity Behavior → failing test → implementation. The contract is built TDD; the frontend is manually verified (one-day build).
- **Wiki always current.** Code and wiki edits ship together.
- **Human in the loop.** When the wiki doesn't answer, stop and ask.

## Project shape

- **Contract:** one file, `contracts/SupplyCheck.sol` — `registerBatch`, `transferCustody` (ordered, append-only), `verifyBatch`, `getBatchHistory`, cold-chain COMPROMISED signal. Spec: `docs/wiki/entities/supplycheck-contract.md` (B1–B13).
- **Frontend:** `frontend/` Vite+React+viem — four stage UIs (Producción, Distribución mundial, Distribución local, Entrega Final) + a Verify view. Spec: `docs/wiki/entities/demo-frontend.md`.
- **Demo:** 1 batch → register → 3 transfers → verify AUTHENTIC; a 2nd batch with cold-chain off → verify COMPROMISED.

## Wiki layout

| Page                          | Purpose                           |
| ----------------------------- | --------------------------------- |
| `docs/wiki/requirements.md`   | Living spec                       |
| `docs/wiki/architecture.md`   | Stack, patterns, test strategy    |
| `docs/wiki/entities/*`        | One page per feature/module       |
| `docs/wiki/decisions/*`       | ADRs                              |
| `docs/wiki/todos.md`          | Priority-ordered work queue       |
| `docs/wiki/gotchas.md`        | Known failure points              |
| `docs/wiki/commands.md`       | Working shell commands            |
| `docs/wiki/log.md`            | Timeline                          |
| `docs/wiki/wiki-todos.md`     | Cleanup queue for wiki-maintainer |

### Frontmatter convention

Every wiki page starts with `name`, `description`, `type` (`wiki-spec` | `wiki-entity` | `wiki-decision` | `wiki-log`), `updated: YYYY-MM-DD`, `status`. Internal links use Obsidian `[[wiki-style]]`; links to non-wiki files (`.claude/...`, `src/...`) use standard markdown.

## Commands

| Command                | Purpose                                           |
| ---------------------- | ------------------------------------------------- |
| `/project:work`        | Top todo → spec → red → green → refactor → commit |
| `/project:interview`   | Q&A to define requirements or features            |
| `/project:review`      | Full audit in isolated worktree                   |
| `/project:wiki-lint`   | Wiki health check                                 |
| `/project:wiki-ingest` | Ingest file or research into wiki                 |
| `/project:init`        | (Re)initialize project wiki and schema            |

## Agent routing

| Task                       | Agent                                                        |
| -------------------------- | ----------------------------------------------------------- |
| Plan complex/batched todos | `planner` (Opus) — before the developer, via `/project:work` |
| TDD cycle                  | `developer` (red → green → refactor; loads skills on demand) |
| Periodic audit             | `reviewer` (worktree-isolated)                               |
| Wiki health                | `wiki-maintainer` (manual only via `/project:wiki-lint`)     |
| Web research               | `researcher`                                                 |

## Golden rules

1. **Wiki is truth.** Code that disagrees with the wiki is the bug.
2. **No contract code without a failing test.** (Frontend: manual dry-run, one-day build.)
3. **Never modify a test to make it pass.** Update spec → regenerate test → implement.
4. **Always update the wiki in the same change.** Touching `contracts/`/`frontend/` requires touching the entity page.
5. **Never modify `docs/raw/`.** Append only.
6. **Agents own `docs/wiki/`.** Humans browse; agents write.
7. **Always branch before coding.** Never commit to `main`.
8. **Conventional commits.** `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
9. **Two-strike rule.** Two failures on the same mechanism → `git tag checkpoint-<stamp>`, `git reset --hard` to known-good, re-spec.
10. **RPC discipline.** Use `https://testnet-rpc.monad.xyz` only; keep a paid backup RPC env-var ready. No real funds, testnet keys gitignored.
11. **Human-in-the-loop.** When the wiki doesn't answer, stop and ask.
12. **Finalize with commit + push.** Every mutating command/agent ends by committing and pushing to the working branch (`git push -u origin <branch>`); read-only commands are exempt.
