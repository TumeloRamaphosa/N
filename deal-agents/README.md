# Deal Agent Team

A small team of **deal agents** (specs in `agents/`) plus an **orchestrator** that turns partner intake into an internal draft collaboration proposal and Africa localization plan for **Agent Chief Lord** to approve.

Nothing in this folder emails partners or sends proposals externally. Approval marks a record **APPROVED (not sent)** only.

## Layout

| Path | Purpose |
|------|---------|
| `agents/*.md` | Agent role specs (inputs, outputs, guardrails) |
| `lib/pipeline.js` | Deterministic agent implementations (no LLM required) |
| `orchestrator.js` | CLI runner — executes agents in order |
| `examples/` | Fictional intake JSON for local demos |
| `portal/` | Optional web intake + review queue |

## Agent order

1. **Intake** — normalize form/JSON  
2. **Compliance gate** — mandatory Robusca status (`Pending` / `Cleared` / `Held`); proposal locked unless `Cleared`  
3. **Strategy** — collaboration model, pilot country  
4. **Localization** — country entry steps  
5. **Proposal writer** — draft markdown for review queue  
6. **Execution planner** — task list **only after** approval  

## Run end-to-end (CLI)

From repo root:

```bash
node deal-agents/orchestrator.js
```

Uses `examples/partner-intake.example.json` (fictional partner, `Cleared` + approved). Output written to `deal-agents/data/runs/<id>.json` (gitignored).

Compliance lock demo:

```bash
node deal-agents/orchestrator.js deal-agents/examples/partner-intake.pending.example.json
```

## Run the portal locally

```bash
cd deal-agents/portal
export PORTAL_USER=demo
export PORTAL_PASS=demo
node server.js
```

Use clearly labelled fictional data on the intake form. Clear screening in the item view to unlock the draft proposal.

## Configuration

- Portal credentials: `PORTAL_USER`, `PORTAL_PASS` (required for the server)
- Optional: `PORT` (default `3000`), `DEAL_AGENTS_OUT` (orchestrator output directory)

Copy `.env.example` to `.env` for local use; `.env` is gitignored.

## Public repo rules

- Fictional example data only — no real partner names, people, emails, screening results, or financial projections  
- Do not name blocked entities listed in project policy  
- No API keys in code; `data/` submissions and runs are excluded from git  
