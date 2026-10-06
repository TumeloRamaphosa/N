# Model house integration

The model house has three separate layers:

1. **Decision layer:** Jev and Laya choose a route, score an option or reject a
   request. They do not replace a prose-generating model.
2. **Generation layer:** a pinned Qwen/Alibaba, DeepSeek or other local model
   handles coding, reasoning or multimodal work through an OpenAI-compatible
   adapter.
3. **Agent layer:** Hermes, OpenClaw, Codex and the DeepSeek Harness call the
   adapter and retain tool permissions, memory scope and audit records.

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
