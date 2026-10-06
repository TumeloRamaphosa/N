# Offline voice for the agent fleet

The model house should provide one speech adapter so Hermes, OpenClaw, Odysseus,
and the StudEx CLI can request speech without knowing which TTS engine is
running. The adapter returns a WAV/PCM stream and reports `model_id`, voice,
language, checksum and latency.

## Recommended tiers

- **Piper:** lowest-resource fallback for short notifications and always-on
  agent alerts. Voice files are usually tens of megabytes and run on CPU.
- **Kokoro-82M:** default natural-sounding local voice for the MacBook or Mac
  mini. It is an 82-million-parameter open-weight model and a small runtime;
  keep the selected voices and exact package on `Models-House/tts/kokoro`.
- **Qwen3-TTS 0.6B/1.7B:** multilingual voice design, custom voice and voice
  cloning. Use on the Mac mini or GCP/Orgo when quality and languages matter;
  it needs more memory and a pinned tokenizer/checkpoint.
- **MLX Audio / mlx-speech:** Apple-Silicon-native TTS/ASR option for offline
  MacBook work. Select a model supported by the runtime and keep its weights on
  `Models-House/tts/mlx`.

Page Agent and the coding agents do not need to load TTS themselves. They send a
notification to the speech adapter, which can run on the MacBook while the
larger reasoning model runs on the Mac mini.

## Storage and Drive policy

Store active voices and checkpoints on the local external model drive:

```text
/Volumes/Models-House/tts/{piper,kokoro,qwen3-tts,mlx}/
```

Store model manifests, checksums, license records, sample transcripts and
generated daily reports in Google Drive. Do not run real-time TTS directly from
Drive; copy verified artifacts to the host cache first. The Google Drive upload
can begin after the Workspace OAuth login is completed.

Official references: [MLX Speech](https://github.com/appautomaton/mlx-speech),
[MLX Audio](https://github.com/Blaizzy/mlx-audio),
[Qwen3-TTS](https://github.com/QwenLM/Qwen3-TTS), and the
[Kokoro offline runtime](https://github.com/pguso/kokoro).
