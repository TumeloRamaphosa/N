# Agent runtime and model placement

The external `/Volumes/Models-House` volume is the model-weight store. The
MacBook has very little free internal space, so it should run control clients,
small workers and browser/page automation. Persistent services and larger local
models belong on the Mac mini or a cloud VM.

| Repository | What it is | Local model requirement | Recommended placement |
|---|---|---|---|
| [Page Agent](https://github.com/alibaba/page-agent) | In-page JavaScript DOM agent | Any reliable instruction-following text model through an OpenAI-compatible endpoint; it does not require vision for DOM tasks. A 3B–7B Qwen/Llama coder is sufficient for a pilot. | MacBook for browser control, using the Mac mini model gateway when the task is larger. |
| [Odysseus](https://github.com/odysseus-dev/odysseus) | Self-hosted AI workspace with agents, MCP, RAG and local-model discovery | Ollama, LM Studio or another OpenAI-compatible endpoint; local embeddings can use `all-minilm`/FastEmbed. Container and database storage are also required. | Mac mini VM or GCP/Orgo. Use the MacBook only for a small local pilot. |
| [DenchClaw](https://github.com/DenchHQ/DenchClaw) | OpenClaw CRM/outreach framework | No bundled model requirement; it inherits the OpenClaw provider configuration. Use a 7B–14B local model for drafting and a stronger cloud model for high-value actions. | Mac mini OpenClaw gateway, isolated profile and workspace. |
| [CashClaw](https://github.com/ertugrulakben/cashclaw) | OpenClaw skills plus budget, recursion and tool-firewall controls | No special model; it wraps an OpenAI-compatible call and enforces cost/token/recursion limits. | Mac mini or cloud worker beside the gateway; keep payment and marketplace keys out of the MacBook. |

## Model tiers

- **MacBook local pilot:** 3B–7B Qwen or Llama, 4-bit/MLX, plus a small
  embedding model. Keep weights on `Models-House`; expose only a localhost or
  authenticated Tailscale endpoint.
- **Mac mini service tier:** 7B–14B coding/reasoning model, embeddings, and the
  Odysseus/DenchClaw/CashClaw services. Use 32B only if the Mac mini has enough
  unified memory after reserving space for the VMs.
- **GCP/Orgo tier:** 32B+ or multimodal models, batch research, browser farms,
  and training. Return commits, reports and checksums to the central repository.

Approximate weight planning for 4-bit models is 0.6–0.8 GB per billion
parameters, plus runtime overhead and KV cache. Plan roughly 5–7 GB for 7B,
10–14 GB for 14B and 22–30 GB for 32B. These are planning estimates, not
guarantees; exact model files and context length change the result.

## Runtime boundaries

Odysseus can connect to a host Ollama endpoint using `OLLAMA_BASE_URL`, and its
configuration supports a remote `LLM_HOSTS` list. DenchClaw creates a separate
OpenClaw profile and gateway by default. CashClaw should sit behind that gateway
with hard daily/call token budgets and its tool denylist enabled.

Keep all three services bound to loopback or private Tailscale addresses, with
authentication enabled. Do not expose raw Ollama, database, MCP, payment or
OpenClaw ports to the public internet.
