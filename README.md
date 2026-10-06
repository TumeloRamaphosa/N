# StudEx Agent Home

This repository is the shared control plane for the StudEx agent fleet. It records
agent identities, model endpoints, memory rules, work conventions, skills and cron
definitions. It is deliberately small: model weights, credentials, VM disks and
volatile runtime caches stay on their host or in approved artifact storage.

## Daily contract

1. An agent reads `agents/registry.yaml` and its assigned work area.
2. Work is written under `work/<agent-id>/` and committed with a descriptive message.
3. Durable decisions are summarized under `memory/<agent-id>/` and linked to that
   agent's Obsidian vault.
4. Large artifacts are uploaded to the approved Drive data room and referenced by
   URL; they are not copied into Git.
5. A host-specific cron runner reads `cron/jobs.yaml`, runs only enabled jobs, and
   writes a report under `reports/`.

The repository is the source of truth for definitions and history. It is not a
shared live filesystem or a place to store secrets.

## Current model-house status

- Jev-Style 2B is already available locally through the MLX service recorded in
  `models/model-house.yaml`.
- Laya is a decision/routing model candidate and still needs a local endpoint and
  pinned checkpoint.
- “Uncensored Alibaba” is treated as a Qwen-family candidate until an exact model
  identifier, license, checksum and modality test are supplied.
- DeepSeek Harness is an experimental provider-neutral orchestration layer. It is
  not installed or trusted as a production authority yet.

See `docs/model-house.md` for the adapter boundary and rollout order.
