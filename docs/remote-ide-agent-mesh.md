# Remote IDE and agent mesh

## Roles

- **VS Code / Cursor:** primary Remote SSH coding clients. Open the `N` checkout
  through `Remote-SSH` and choose an existing host from `~/.ssh/config`.
- **Antigravity / Conductor / Devin:** orchestration and agent clients. Give each
  agent the same repository path, SSH host alias, branch policy and gateway URL.
- **Tailscale:** private transport between the MacBook, Mac mini, VMs and cloud
  hosts. Do not publish SSH or the model gateway to the public internet.
- **RustDesk or macOS Screen Sharing:** optional graphical desktop access. SSH
  remains the control path for builds and automation.

## Shared hosts

The existing SSH aliases are the source of truth. Important targets include
`hermes-vm`, `studex-agent`, `studex-command`, `studex-factory`,
`studex-nexus-hub`, `dark-factory`, `global-markets-rwanda`, and `studex-tattoo`.
Use `ssh -G <alias>` to inspect a resolved target without connecting.

## Model gateway

The model house is mounted at `/Volumes/Models-House` with approximately 893 GiB
free in the current inventory. Keep model weights and indexes there, while Git
checkouts, prompts, and durable memory remain in the agent workspaces.

Use one OpenAI-compatible gateway per execution floor:

```text
local MacBook Ollama/MLX:  http://127.0.0.1:11434/v1
Mac mini Hermes gateway:   http://<tailscale-host>:<gateway-port>/v1
GCP/Orgo gateway:          private Tailscale address or authenticated HTTPS
```

Only expose a gateway on a Tailscale interface after authentication and an
allow-list are configured. Do not put provider keys in Git, LaunchAgents, or IDE
workspace settings.

## Operating pattern

1. The user opens the same repository in VS Code or Cursor over Remote SSH.
2. An agent in Antigravity, Conductor, Devin, Hermes, or OpenClaw receives the
   task and selects a host based on the task label (`local-pilot`, `build`,
   `simulation`, or `large-model`).
3. The agent runs builds and tests on that host, commits its work, and writes a
   report and token usage to the agent home.
4. The MacBook dashboard reads status over Tailscale; it does not run the heavy
   build locally.

VS Code and Cursor can share the same `.vscode` workspace recommendations. The
   other IDEs should use the same SSH aliases and repository contract rather than
   duplicating model downloads or memory stores.
