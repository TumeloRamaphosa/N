# StudEx Harness: AutoResearch + MiroFish

## What each component does

**DeepSeek Harness** is the orchestration layer. It selects providers, invokes
tools and records execution. It is not a model.

**AutoResearch** is an experiment loop from Karpathy's repository. An agent edits
a bounded training file, runs a fixed five-minute experiment, evaluates a metric,
and keeps or discards the change. The upstream setup targets one NVIDIA GPU and
nanochat training; it is not a drop-in MLX training system for this MacBook.

**MiroFish** is a multi-agent scenario simulator. It turns seed documents into a
knowledge graph and agent personas, runs social/world interactions and produces a
prediction report. It should be treated as scenario analysis, not evidence of what
will happen. The main project is AGPL-3.0, so review its license obligations before
embedding or offering a modified service.

## StudEx composition

```text
Voicebox / images / PDFs / client files
                 ↓
        evidence and consent filter
                 ↓
   StudEx Harness (DeepSeek Harness adapter)
       ├── Jev/Laya: route, score, guardrail
       ├── Qwen/Llama/DeepSeek distilled: generate and reason
       ├── multimodal worker: image/audio/video extraction
       ├── AutoResearch: test prompts, routing, LoRA and tool policies
       └── MiroFish: simulate market, customer and operations scenarios
                 ↓
  evaluator → approved result → Git + Obsidian + RAG memory
```

AutoResearch must never directly promote a model or change production tools. Each
experiment gets a branch, a fixed budget, a dataset hash, a metric, a diff and a
human approval gate. MiroFish receives approved seed material and writes a report
with assumptions, simulated agents, random seed, model versions and uncertainty.

## Four-model routing

- Jev and Laya make fast typed decisions; they do not generate the final answer.
- A local Qwen or Llama model handles routine coding, summarisation and tool
  preparation.
- A quantized DeepSeek distill or larger Qwen handles difficult reasoning.
- A multimodal Qwen-VL/Omni worker handles images, audio and video. DeepSeek
  Harness, Hermes and OpenClaw call all of these through one local gateway.

This composition saves tokens by routing easy requests early, retrieving only the
relevant memory, summarising long histories and using cached prompt prefixes. It
does not make the models' weights into one new model.

## Where GPT-5 belongs

There is no standard model identifier called “GPT-504”. If the intended model is
GPT-5, run it as a controlled cloud evaluator through the OpenAI API, behind the
StudEx gateway. Use it for difficult research synthesis, benchmark judging,
multimodal review or promotion decisions. Keep API keys server-side and record
model ID, request ID, token usage and data classification.

The MacBook should run the local Jev/Laya/Qwen/Llama workers natively with MLX or
Ollama. A VM should host the sandboxed harness, MiroFish and experiment runners.
The VM can call GPT-5 only for data approved to leave the local environment.

## First pilot

1. Use Voicebox to capture a StudEx question and save it to the context inbox.
2. Ask the local gateway to classify it with Jev/Laya.
3. Route routine work to Qwen/Llama and difficult work to a DeepSeek distill.
4. Run one MiroFish scenario from an approved business brief.
5. Run AutoResearch on a small router/prompt/LoRA experiment, not production code.
6. Compare local results with GPT-5 as an evaluator, then store the decision and
   evidence in Git, Obsidian and the RAG index.
