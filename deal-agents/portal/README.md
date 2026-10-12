# Studex Partner Deal Portal (prototype)

Minimal Node HTTP server for partner intake and internal review. Uses the shared Deal Agent Team pipeline in `../lib/pipeline.js`.

## Run

From `deal-agents/portal/`:

```bash
export PORTAL_USER=demo
export PORTAL_PASS=demo
node server.js
```

Open http://127.0.0.1:3000 (basic auth). Submissions are stored in `data/submissions.json` (gitignored).

Proposals stay **locked** until Robusca sets screening to **Cleared**. Approval only sets status to APPROVED (not sent).
