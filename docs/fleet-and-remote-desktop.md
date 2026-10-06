# Fleet hub and private remote access

The MacBook already has a read-only bridge at `127.0.0.1:8794` that reports
Tailscale peers, local ports, Ollama, Herdr, Orgo and GCP. It now serves
`/studex-fleet-hub.html`, a single page linking the existing dashboards and showing
the same live inventory.

The current MacBook tailnet identity is `macbook-pro-5` at `100.95.66.29`.
Tailscale is running. The bridge remains localhost-only; expose it to the tailnet
with Tailscale Serve after reviewing the tailnet ACLs. Do not bind the dashboard
or model APIs to the public network.

NoMachine is not installed on this MacBook. NoMachine requires a client on the
MacBook and an NX server on each target VM/host. Its usual port is 4000, which is
already used by the local model door, so use the remote host's own Tailscale IP and
avoid port assumptions. Each machine needs its own account and an ACL permitting
only the required operator devices.

The fleet page is deliberately read-only. It does not start VMs, dispatch agents,
install NoMachine or expose Orgo/GCP credentials. Those actions need separate,
authenticated APIs and explicit per-host permissions.
