# Model house integration

The model house has three separate layers:

1. **Decision layer:** Jev and Laya choose a route, score an option or reject a
   request. They do not replace a prose-generating model.
2. **Generation layer:** a pinned Qwen/Alibaba, DeepSeek or other local model
   handles coding, reasoning or multimodal work through an OpenAI-compatible
   adapter.
3. **Agent layer:** Hermes, OpenClaw, Codex and the DeepSeek Harness call the
   adapter and retain tool permissions, memory scope and audit records.

## Gateway and knowledge layers

Use OmniRoute, if its isolated pilot passes, as the single OpenAI-compatible door
for Hermes, OpenClaw, MiroFish and coding tools. Its documented endpoint is
`http://127.0.0.1:20128/v1`; it also advertises MCP and A2A surfaces and a
compression pipeline. Keep it bound to localhost or a private Tailscale network,
scope its keys, and benchmark compression fidelity before enabling aggressive
modes. OmniRoute's routing memory must not silently become the company memory.

Use one authority per knowledge function:

- **TencentDB Agent Memory:** governed chat memory, skills, LLM-Wiki and code-graph
  assets when its RBAC and tenant boundaries pass review.
- **Graphify / Code Graph:** repository structure and dependency relationships;
  refresh it after code changes.
- **Obsidian:** editable local business wiki and agent brains.
- **Notion:** shared human-facing index and approvals, with links back to the
  canonical Git/Obsidian records.
- **MiroFish/Neo4j:** scenario graph and simulated-world state, kept separate from
  authoritative company facts.

This prevents duplicated facts and conflicting “memories.” The gateway retrieves
from the approved memory layer; it does not decide which copy of a business fact is
correct.

The first safe connection is a local gateway that exposes health and usage data for
each model. Hermes and OpenClaw should point to that gateway rather than loading
model files directly. DeepSeek Harness can be tested as another client because its
provider guide supports OpenAI Chat Completions, OpenAI Responses and Anthropic
Messages endpoints. There is no assumed native Hermes/OpenClaw adapter.

## Rollout

1. Keep the verified Jev endpoint as the router and measure decisions.
2. Pin one official Qwen checkpoint for coding; record checksum, context, license,
   quantization and tool-call tests before considering any community uncensored
   fine-tune.
3. Add a separate Qwen-VL/Omni worker only if the required modality is tested.
4. Install DeepSeek Harness only in a disposable least-privilege VM, then connect
   it to the gateway and compare task success, latency and token usage.
5. Add Laya after its checkpoint and local serving protocol are pinned.

Quantized weights can be replicated to several workers. Live KV caches are
session-specific runtime state and are not portable model files. Use replication
for throughput first; use tensor or pipeline sharding only on a fast private link
after a benchmark proves it is worthwhile.
