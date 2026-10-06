# Graph Report - N  (2026-10-06)

## Corpus Check
- 15 files · ~3,669 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 49 nodes · 35 edges · 14 communities (6 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `df1b617d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- StudEx Agent Home
- Model house integration
- memory/README.md
- obsidian/README.md
- work/README.md
- Findings
- StudEx Harness: AutoResearch + MiroFish
- context/README.md
- dictation_to_context.sh
- local-model-selection.md
- fleet-and-remote-desktop.md
- Cloud-first build policy
- hourly_runtime_cache_reset.sh
- Remote IDE and agent mesh

## God Nodes (most connected - your core abstractions)
1. `StudEx Harness: AutoResearch + MiroFish` - 6 edges
2. `Remote IDE and agent mesh` - 5 edges
3. `Findings` - 5 edges
4. `StudEx Agent Home` - 3 edges
5. `Cloud-first build policy` - 3 edges
6. `Model house integration` - 3 edges
7. `StudEx source-file review — 2026-10-06` - 3 edges
8. `dictation_to_context.sh script` - 1 edges
9. `hourly_runtime_cache_reset.sh script` - 1 edges
10. `Daily contract` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (14 total, 8 thin omitted)

### Community 0 - "StudEx Agent Home"
Cohesion: 0.50
Nodes (3): Current model-house status, Daily contract, StudEx Agent Home

### Community 1 - "Model house integration"
Cohesion: 0.50
Nodes (3): Gateway and knowledge layers, Model house integration, Rollout

### Community 5 - "Findings"
Cohesion: 0.25
Nodes (7): Canonical integration decision, Findings, `nexus-command-deck.html`, `nexus-command-deck-offline.html`, StudBot integration plan, `studex-master-os.html`, StudEx source-file review — 2026-10-06

### Community 6 - "StudEx Harness: AutoResearch + MiroFish"
Cohesion: 0.29
Nodes (6): First pilot, Four-model routing, StudEx composition, StudEx Harness: AutoResearch + MiroFish, What each component does, Where GPT-5 belongs

### Community 11 - "Cloud-first build policy"
Cohesion: 0.50
Nodes (3): Cloud-first build policy, Memory and reset boundary, Placement

### Community 13 - "Remote IDE and agent mesh"
Cohesion: 0.33
Nodes (5): Model gateway, Operating pattern, Remote IDE and agent mesh, Roles, Shared hosts

## Knowledge Gaps
- **28 isolated node(s):** `dictation_to_context.sh script`, `hourly_runtime_cache_reset.sh script`, `Daily contract`, `Current model-house status`, `Context inbox` (+23 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 42 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `dictation_to_context.sh script`, `hourly_runtime_cache_reset.sh script`, `Daily contract` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._