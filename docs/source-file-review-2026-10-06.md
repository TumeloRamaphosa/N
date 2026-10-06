# StudEx source-file review — 2026-10-06

Reviewed from the Desktop:

- `STUDBOT_INTEGRATION_PLAN.md`
- `nexus-command-deck-offline.html`
- `nexus-command-deck.html`
- `studex-master-os.html`

## Findings

### StudBot integration plan

The plan proposes Kestra for versioned workflows, a pentest agent, ReadAny for
research, m3e-canvas for campaign graphs and Fleetbase for future fulfilment. It
also names StudBot roles such as Naledi, OpenClaw, CashClaw, Adam, QA and a new
ComplianceOfficer.

The proposal is useful as a roadmap, but “launch-ready” is a business assertion,
not a technical verification. The Kestra YAML is illustrative rather than a
validated flow, and the plan does not yet define credentials, consent records,
approval gates, idempotency, retries, test data or a production owner.

Recommended placement: keep the plan as product strategy, then create executable
Kestra flows only after they are mapped to `agents/registry.yaml` and the model
gateway in this repository.

### `nexus-command-deck-offline.html`

This is the only file with a working chat path. It probes Ollama at
`http://localhost:11434`, calls the hard-coded `qwen2.5:14b` model, and falls back
to a cloud Grok URL containing the literal placeholder `YOUR_GROK_KEY`. It also
connects to an external WebSocket relay and registers a service worker.

Consequences:

- It is not fully offline because cloud fallback and the relay remain enabled.
- Opening it as a local `file://` page can fail because of browser CORS policy.
- Model responses and agent names are inserted with `innerHTML`; untrusted model
  output could inject markup or script.
- The model, gateway URL, timeout, token budget, memory and audit logging are not
  configurable from the canonical model-house manifest.

### `nexus-command-deck.html`

This is a visual “Agent Lord” command deck. It seeds 13 seats with hard-coded
online/degraded statuses and shows model ports `4000`, `8009`, `8011`, `8012`,
`18789`, `19001` and `8792`. The only runtime integration is the script loaded
from `http://127.0.0.1:8794/studex-desk-live.js`.

It should be treated as a read-only dashboard until a typed status API is defined.
The labels do not prove that the services are running, and there are no controls
that safely dispatch an agent task.

### `studex-master-os.html`

This is another static visual shell for the StudEx hierarchy. Agent cards and cloud
partners are presentation data. Clicking an agent or partner only displays an
alert; it does not connect to an agent, VM or cloud account. It also loads the
local port-8794 bridge and external Google fonts, so it is not an offline-only
artifact.

## Canonical integration decision

The dashboards should consume a read-only `/v1/status` endpoint generated from
`agents/registry.yaml` and the model-house health checks. They should never hold
provider keys or call model providers directly. Chat should call one local model
gateway, which applies Jev/Laya routing, model permissions, memory retrieval and
token accounting.

Before enabling actions, add:

1. an authenticated local status API;
2. an explicit task-dispatch API with an allowlisted agent and tool scope;
3. safe text rendering instead of `innerHTML` for model output;
4. a CSP and removal of placeholder credentials;
5. a visible offline mode that disables all cloud and relay calls;
6. tests for Ollama unavailable, gateway timeout, malformed model output and
   WebSocket failure.

No source dashboard was modified by this review.
