# Next-Nexus current status

**Last updated:** 2026-10-06

Next-Nexus is the shared control plane for the StudEx agent fleet. GitHub is the
current source of truth for definitions and history; Notion will be the operator
workspace once an editable page is supplied.

## Working now

- Central repository: `https://github.com/TumeloRamaphosa/N`
- Agent registry: `agents/registry.yaml` with Codex, Claudio, Adam Smasher,
  Robusca, Sentinel, Katjana, MiniMax Fleet and Nexus Server.
- Model house: local, cloud and speech entries with runtime, placement and
  provenance fields.
- `tools/studex-agent`: dependency-free CLI for fleet listing, model selection
  and dry-run task requests.
- Hourly runtime-cache cleanup: loaded as `com.studex.cache-reset`; it removes
  only allow-listed temporary files older than one hour.
- Cloud-first build policy: MacBook control plane, Mac mini gateway, GCP/Orgo
  heavy builds and simulations.
- Remote IDE contract: VS Code, Cursor, Antigravity, Conductor and Devin use the
  shared SSH/Tailscale host aliases.
- Mobile plan: Flutter Android/iOS client, Cactus or MiniCPM5 local mode, and an
  authenticated WebSocket connection to the Mac mini gateway.
- Offline speech plan: Piper/Kokoro for lightweight voice and Qwen3-TTS/MLX
  Speech for higher-quality local voice.
- External model storage: `/Volumes/Models-House` has approximately 893 GiB
  free. No destructive repartitioning or USB flashing has been performed.
- `scrcpy` is installed on the MacBook, but the Samsung phone is not yet visible
  to ADB; USB debugging authorization is still required.

## Current model routing

- Phone/MacBook: MiniCPM5-1B/2B or a verified Cactus bundle.
- Mac mini: Qwen/Llama 7B–14B or Ornith 9B for coding and orchestration.
- GCP/Orgo: larger multimodal, batch and training workloads.
- Page Agent, Odysseus, DenchClaw and CashClaw use the shared OpenAI-compatible
  model adapter rather than owning separate model stores.

## Next-Nexus operating pages

The Notion workspace should mirror these pages:

1. **Fleet Registry** — agent identity, owner, host, status and capabilities.
2. **Model House** — model ID, format, checksum, license, size, host and tests.
3. **Agent Workboard** — task, agent, repository, branch, status and artifact.
4. **Memory and RAG** — approved durable sources and retrieval policies.
5. **Operations** — ports, gateways, schedules, cache reports and incidents.
6. **Cost and Tokens** — per-agent model, input/output tokens, cache use and
   provider cost.
7. **Security** — credentials location, device approvals and access reviews.

Notion should contain links and operational summaries. Git remains authoritative
for code, registry changes, model manifests and reproducible configuration.
