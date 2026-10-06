# Context inbox

Voicebox transcripts enter `context/dictation/` through
`tools/dictation_to_context.sh`. Review and classify them before indexing into
shared RAG memory. Do not commit credentials, private client data or unreviewed
audio transcripts to a public repository.

For the existing Voicebox installation, use the script as its post-transcript
hook. To mirror into an Obsidian vault, set `STUDEX_OBSIDIAN_DIR` explicitly.
