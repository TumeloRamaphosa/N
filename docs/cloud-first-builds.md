# Cloud-first build policy

The MacBook is the control plane: CLI, dashboard, Obsidian, small local models,
review and secure access. It is not the default build or simulation worker.

## Placement

- **MacBook:** source checkout, Obsidian, dashboard, Jev/Laya, small Ollama/MLX
  workers, Git review and Tailscale client.
- **Mac mini VM:** Hermes/OpenClaw gateway, local integration tests and agent
  coordination.
- **Orgo/GCP VMs:** builds, tests, MiroFish/Neo4j simulations, large models and
  scheduled jobs. Store artifacts in object storage and record checksums in Git.

Agents should create a short-lived cloud worktree or job, build and test there,
then return a commit, artifact URL and report. They should not compile large
projects, download weights or run Docker/Neo4j on the MacBook unless the task is
explicitly labelled `local-pilot`.

## Memory and reset boundary

Durable memory is stored in Git, Obsidian, approved RAG/TencentDB records and
reports. Runtime caches are disposable. The hourly reset job only deletes files in
its explicit allowlist, older than one hour, and writes reclaimed-space metrics.
It does not delete model weights, VM images, credentials or memory.

Before a cloud job starts, the agent records repository commit, data classification,
model ID, owner, budget and destination. After completion it saves logs, tests,
artifact checksums, token usage and the memory summary back to the agent home.
