# Memory contract

`memory/` contains durable, reviewed summaries and links. Raw conversations and
secrets do not belong here.

- `memory/<agent>/` is the agent's durable record.
- Shared decisions go in `memory/shared/` with an owner and date.
- Obsidian vaults are the human-readable second brain; link their notes here rather
  than copying every note.
- Retrieval systems (gbrain, a vector store, Honcho or another backend) are
  replaceable indexes over approved files. The repository remains the authority.
- Every memory entry should include `source`, `created_at`, `owner`, `confidence`
  and `supersedes` when applicable.
