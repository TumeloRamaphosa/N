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

## Linked repos

`repos/registry.yaml` is a manifest of linked repositories. Each entry is a card with
`what_it_is`, `what_it_does`, `maker`, `licence`, `recommendation`, plus `location`,
`visibility`, `used_by`, and `access: read`. Agents clone or read these repos at runtime
with their own credentials. This repo does not use submodules and does not copy content
from linked repos; private material never lands here.

| id | what_it_is | recommendation (summary) |
|----|------------|---------------------------|
| `openjarvis` | Local-first personal AI framework (Stanford OpenJarvis) | Trial on the Mac mini; sandboxed, no keys |
| `meetings-vault` | Private meetings repo and Obsidian vault | Source of truth for meeting records |
| `lifecycle-innovations` | TBC | Awaiting full URL from Agent Chief Lord |
| `agents-office` | 3D office routing tasks across 35 agents | Internal Mac mini trial only; not for StudBot (licence) |

Licence and maker for public repos are verified from upstream `LICENSE` / README when
reachable; otherwise fields are `TBC`. See the manifest for full card text.

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

## Chief-of-staff trio

`email-agent`, `notion-agent`, and `meeting-agent` report to **Robusca**, who
coordinates them and owns escalation.

`meeting-agent` turns meetings into structured records and routes follow-ups to
`email-agent`, which prepares drafts for human approval before anything is sent.
`notion-agent` reflects status and briefs in the Notion Command Centre.

The **deployment team** (`vercel-agent`, `cloudflare-agent`, `gcp-agent`, and
`vercel-foreman`) are standalone agents that support `claudio`. `vercel-foreman`
oversees `vercel-agent`; `vercel-agent` reports to the foreman. `cloudflare-agent`,
`gcp-agent`, and `vercel-foreman` report to Robusca. See `docs/deployment-routing.md`
for platform boundaries. Every live deploy, DNS change or spend requires Agent Chief
Lord approval before execution.
