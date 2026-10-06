# MiniCPM5 and Cactus compatibility

## MiniCPM5

OpenBMB describes MiniCPM5-1B and MiniCPM5-2B as small on-device dense text
models aimed at coding, long context, tool use and agent tasks. Official MLX
deployment is available for Apple Silicon, and official GGUF checkpoints can be
used with a compatible `llama.cpp` build. A 4-bit 2B checkpoint is a sensible
MacBook/phone router; a 1B checkpoint is better for always-on classification and
tool selection. Exact file size depends on quantization, tokenizer and runtime;
plan roughly 0.8–2.5 GB for a 1B/2B quantized deployment including overhead.

MiniCPM5 can serve all four runtimes through an OpenAI-compatible adapter:

- **Page Agent:** use MiniCPM5 behind a local chat-completions server for DOM
  planning. Page Agent does not require vision for DOM tasks.
- **Odysseus:** configure its Ollama/LM Studio or OpenAI-compatible endpoint to
  the MiniCPM5 server. Keep embeddings as a separate small model.
- **DenchClaw/OpenClaw:** configure the provider or gateway to the same endpoint;
  DenchClaw itself does not require a particular model family.
- **CashClaw:** wrap the same endpoint and keep its hard cost, token, recursion
  and tool-firewall policy enabled.

## Cactus

Cactus is an on-device engine with C, Python, Swift, Kotlin, Flutter and React
Native bindings. It provides chat, streaming, tool calling, vision, audio,
transcription, embeddings, RAG and cloud handoff. Its prebuilt model bundles
currently emphasize Gemma, Qwen, Liquid, Whisper, Parakeet and Nomic Embeddings.
Use Cactus on the phone for the local model and expose a small authenticated
bridge to the app. Use Ollama/MLX/llama.cpp on the Mac mini for larger models.

Do not assume MiniCPM5 will run in Cactus just because Cactus can convert an
arbitrary Hugging Face model. The Cactus documentation marks conversion and
runtime bundle generation for unsupported models as experimental. First use an
official Cactus bundle; add MiniCPM5 only after an on-device build, tool-call
test, context test and checksum are recorded.

## Recommended routing

```text
Phone: Cactus + 1B/2B MiniCPM5 or prebuilt Gemma/LFM bundle
MacBook: MLX MiniCPM5-2B + Page Agent + TTS
Mac mini: Odysseus/DenchClaw/CashClaw + 7B–14B Qwen/Llama gateway
GCP/Orgo: multimodal, batch and larger reasoning models
```

References: [MiniCPM](https://github.com/OpenBMB/MiniCPM),
[MiniCPM MLX deployment skill](https://github.com/OpenBMB/MiniCPM/blob/main/skills/minicpm5-deploy-mlx/SKILL.md),
[Cactus](https://github.com/cactus-compute/cactus), and its
[engine model documentation](https://github.com/cactus-compute/cactus/blob/main/docs/cactus_engine.md).
