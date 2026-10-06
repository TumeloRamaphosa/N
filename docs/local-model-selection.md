# Local model selection

For the 32 GB Apple Silicon MacBook, start with one primary generator and small
specialists:

- Qwen3 or Qwen2.5 8B/14B quantized through Ollama or MLX for Hermes/OpenClaw.
- Jev-Style 2B and Laya 322M/421M for routing and typed guardrails.
- LFM2.5-1.2B or 2.6B for fast low-latency classification, summaries and device
  tasks; LFM2.5-VL is a candidate for small visual tasks.
- `nomic-embed-text` or a reviewed local embedding model for MiroFish/Neo4j.

Liquid's LFM family is attractive for edge latency and small memory footprints,
but each checkpoint must be benchmarked for tool calls and checked against its
commercial license. Perplexity's Sonar is a hosted service; Perplexity's Portable
Computer local models target supported NVIDIA/AMD systems, not this Apple Silicon
MacBook.

MLX is the Apple Silicon execution/runtime layer. Quantization is the numerical
format of the weights. MLX plus an MLX-quantized checkpoint is often the best local
combination; Ollama generally serves GGUF quantized artifacts. Q4 saves the most
memory, while Q6/Q8 usually preserve more coding and tool-call quality.

Do not select a model only because it is small. Benchmark StudEx tasks for answer
quality, tool success, latency, memory, context length and hallucination rate.
