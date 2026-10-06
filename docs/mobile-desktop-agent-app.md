# StudEx mobile and desktop agent app

PrivateAgent uses Flutter for the user interface, an OpenAI-compatible chat
endpoint for the brain, and a native Android Accessibility Service for screen
reading and actions. We can use the same shape for StudEx while replacing the
single provider with our model-house gateway.

## Shared architecture

```text
Flutter app (phone/desktop)
        |
        | HTTPS or Tailscale WebSocket
        v
StudEx gateway: identity, fleet routing, policy, memory, token budget
        |
        +-- Ollama/MLX on MacBook or Mac mini
        +-- cloud model adapter on GCP/Orgo
        +-- TTS/STT adapter for offline voice
        +-- MCP tools and Herdr/OpenRig dispatch
```

The app should never contain provider keys or model weights. It holds a short-
lived device token and receives task updates, screenshots/UI descriptions and
approval prompts from the gateway. The gateway records the task, selected agent,
model ID, token usage, actions and final artifact in the agent work folder.

## Platform adapters

- **Android:** Flutter plus an Accessibility Service, notification permission and
  optional Shizuku integration. This is the closest match to PrivateAgent and
  can read UI nodes, tap, scroll and type after the user grants permission.
- **macOS:** Flutter desktop plus macOS Accessibility/Screen Recording
  permissions. Use AXUIElement for native apps and Page Agent for browser DOM
  tasks. Tailscale SSH is the remote execution path for the fleet.
- **Windows:** Flutter desktop plus UI Automation and optional WinAppDriver-style
  adapters. Keep the same action schema as Android/macOS.
- **Linux:** Flutter desktop plus AT-SPI where supported, with browser DOM
  automation and SSH for server work.
- **iOS/iPadOS:** use App Intents, Shortcuts, deep links and approved APIs. iOS
  does not provide the same unrestricted cross-app accessibility control as
  Android, so the product must use explicit integrations rather than promise
  universal screen control.

## One task protocol

The app sends a task such as `open the StudBot dashboard and show failed jobs`.
The gateway returns a plan and asks for approval when the action is sensitive.
Each loop contains:

```json
{
  "task_id": "...",
  "screen_context": {"platform": "android", "ui_nodes": []},
  "allowed_actions": ["tap", "type", "scroll", "open_app"],
  "model": "qwen-local",
  "step": 3,
  "max_steps": 30
}
```

The platform adapter executes only the allowed action and returns a structured
result. It never receives raw provider credentials. Shell, payments, account
changes and destructive actions require a separate approval capability.

## Offline and cloud modes

- **Offline:** phone/desktop connects over LAN or Tailscale to the MacBook or
  Mac mini gateway; Ollama/MLX and the TTS adapter run locally.
- **Connected:** the gateway routes large reasoning or multimodal tasks to GCP or
  Orgo and returns the result to the same app session.
- **Disconnected:** the app queues permitted tasks and local notifications; it
  does not silently perform cloud actions when connectivity returns.

## Release plan

1. Flutter Android pilot with Page-Agent-style task loop and local Ollama.
2. Flutter macOS desktop client using the same gateway and Tailscale identity.
3. Add Windows/Linux adapters and package APK, DMG, MSI and AppImage releases.
4. Add Herdr/OpenRig fleet dispatch, voice input/output and per-agent memory.
5. Add signed updates, device revocation, audit logs and model checksum checks.

PrivateAgent’s release model demonstrates universal and architecture-specific APKs
with checksums. StudEx should use the same release discipline for every platform.

## Fully local GGUF mode

The [Uncensored Local AI Multi-Platform project](https://github.com/techtonic2025/Uncensored-Local-AI-Multiplatform)
uses Flutter and `llama.cpp` to load GGUF models on Android, iOS and desktop. Its
architecture is a useful reference for a StudEx local mode:

- ship the Flutter shell and `llama.cpp` native bindings;
- let the user import a verified GGUF model from the device or
  `Models-House`;
- expose a loopback OpenAI-compatible endpoint for IDEs and the StudEx CLI;
- store conversations and model metadata locally;
- optionally connect to the Mac mini gateway when a phone cannot fit the chosen
  model.

For the Android phone, begin with a 2B–4B quantized model. A 2B model is around
1.6 GB in the referenced project; a 4B–8B Q4 model may need roughly 2.5–6 GB
plus runtime memory, so the phone must have adequate free RAM and storage. Keep
the model selector and download manager separate from agent credentials.

For iOS, build from the Flutter project with Xcode, sign the app with the Apple
developer account, and distribute through TestFlight/App Store or an approved
development install. iOS can run local GGUF inference, but it has tighter
background execution, filesystem and distribution rules. Cross-app screen
automation remains restricted; use Share Extensions, App Intents, Shortcuts,
URL schemes and explicit integrations instead of Android-style Accessibility.

The StudEx app should offer three selectable modes:

1. **Device-local:** GGUF model runs on the phone or desktop; no network needed.
2. **Private fleet:** the app sends requests over Tailscale to Hermes/OpenClaw,
   Ollama/MLX and the registered agents.
3. **Cloud fallback:** only an approved task and model policy may route to GCP or
   Orgo, with token and data-classification controls.

Treat community “uncensored” checkpoints as untrusted candidates. Record the
exact file hash, license, tokenizer, context limit and tool-call tests in the
model house before making one available to agents.

## GoClaw, ZeroClaw and ten agent profiles

GoClaw is a Go gateway with REST/WebSocket access, provider adapters, teams,
memory and security layers. Its desktop Lite edition is limited to five agents;
the server edition is the better fit for a larger fleet. ZeroClaw is a small Rust
binary with pluggable Ollama/OpenAI-compatible providers, HTTP/WebSocket gateway,
ACP IDE integration and sandboxed tool execution. Both can sit behind the
StudEx gateway, but they should not both become the fleet authority at the same
time.

Recommended layout:

```text
Mac mini VM or GCP/Orgo Linux host
  studex-gateway
    zeroclaw profile agent-01 ... agent-10   # isolated workspaces/configs
    or goclaw server team                    # alternative fleet runtime
    Ollama/llama.cpp/MLX adapter             # shared model endpoint
    WebSocket + Tailscale                    # phone/desktop clients
```

Use separate workspaces, memory roots, model budgets and tool policies for each
agent. Ten processes may share model weights through one gateway, but each needs
its own session state and rate limits. Do not run ten autonomous gateways on a
phone.

## Connecting the phone

- **Android:** connect USB, enable Developer Options and USB debugging, confirm
  the computer fingerprint, then use `flutter devices` and `flutter run -d
  <device-id>` for a development build. The release APK should be signed and
  installed only after its checksum is recorded.
- **iPhone:** connect USB, trust the Mac, enable Developer Mode, select a signed
  development team in Xcode and run the Flutter iOS target. TestFlight is the
  normal distribution path; arbitrary sideloading is limited by Apple’s signing
  rules.
- **WebSocket:** the mobile app opens one authenticated `wss://` connection to
  the private gateway. Use Tailscale or an HTTPS reverse proxy; never expose a
  raw unauthenticated gateway port.
- **VMs:** keep Linux VMs on the Mac mini, GCP or Orgo. Android can use a limited
  Linux userland such as Termux, but a phone is not a practical host for ten
  full VMs or large model runtimes. The phone should run the UI, offline small
  GGUF model and queued tasks.

Kiro’s IDE, CLI, web and mobile surfaces are useful clients for the same task
protocol, specs, skills, hooks and MCP tools; Kiro itself is not the local model
runtime. Keep its project rules aligned with `agents/registry.yaml` and the
StudEx gateway policy.
