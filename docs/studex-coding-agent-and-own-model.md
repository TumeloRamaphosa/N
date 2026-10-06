# StudEx coding agent and model

## What we own

The product should be an adapter-based coding agent, not a new foundation model
on day one:

1. `studex-agent` discovers the registered fleet and selects an agent identity.
2. A model adapter sends the task to Ollama, MLX, OpenRouter, or a cloud worker
   through one OpenAI-compatible interface.
3. A policy layer controls repository scope, shell permissions, secrets, network,
   approval requirements and budget.
4. A memory writer records the plan, patch, tests, token usage and decision in
   `work/<agent-id>/`, `memory/<agent-id>/` and the linked Obsidian vault.
5. Herdr/OpenRig become fleet schedulers: they choose a host and agent, while the
   CLI remains the stable interface used by VS Code, Cursor, Antigravity,
   Conductor and Devin.

The current CLI is deliberately read-only. It can list agents, show the selected
model gateway and send a task to a model in dry-run or request mode. File edits,
shell execution, deployments and external MCP actions need a sandbox and explicit
policy before being enabled.

```bash
tools/studex-agent fleet list
tools/studex-agent model show
tools/studex-agent run --agent codex --task "Review the authentication module" --dry-run
```

Set `STUDEX_MODEL_BASE_URL` and `STUDEX_MODEL` per host. Local Ollama defaults to
`http://127.0.0.1:11434/v1`; a remote host is reached through a private Tailscale
address or an SSH tunnel.

## Building our model

Use a staged approach:

- **Stage 1:** route to a pinned local coding model and add retrieval from the
  agent home, repository and skills library.
- **Stage 2:** collect accepted plans, patches, tests and corrections with consent;
  redact secrets and personal data, and record model/checkpoint provenance.
- **Stage 3:** supervised fine-tuning or LoRA on those examples for StudEx coding
  conventions. Evaluate on held-out tasks before routing production work.
- **Stage 4:** distill routing, planning and code-review behaviours into smaller
  MLX/GGUF workers. Keep the general coding model replaceable.

This creates a business-specific StudEx model through data, retrieval, adapters
and evaluation. Training a foundation model from scratch is a later research
project requiring a multi-GPU cluster and a much larger validated dataset.
