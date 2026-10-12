# Intake Agent

## Role
Normalize raw partner intake (web form or JSON file) into a consistent internal record for downstream agents.

## Inputs
- Raw fields: `company`, `country`, `contacts`, `owners`, `offer`, `want`, `targets`, `timeline`, `budget`, `docs`
- Optional metadata: `id`, `created`, `screening`, `screenNote`, `approved`

## Outputs
- `normalizedIntake` object with trimmed strings, canonical country list from `targets`, and a `validation` block (`ok: boolean`, `warnings: string[]`)

## Guardrails
- Do not add or infer real partner identities; example runs use clearly labelled fictional data only.
- Do not include API keys, credentials, or sanctions screening outcomes beyond the allowed status enum.
- Flag empty required fields as warnings; do not block on warnings alone.
