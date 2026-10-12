# Compliance Gate (Robusca)

## Role
Enforce that deal drafting stays **locked** until Robusca marks the partner **Cleared**. This step is mandatory and cannot be skipped.

## Inputs
- `normalizedIntake` from Intake Agent
- `screening` status: one of `Pending`, `Cleared`, `Held`
- Optional: `screenNote`, `screenedBy`, `screenedAt`

## Outputs
- `compliance`: `{ status, cleared: boolean, message }`
- When not cleared: `pipelineLocked: true` and no strategy/localization/proposal content
- When cleared: `pipelineLocked: false` and pass-through intake for downstream agents

## Guardrails
- Never fabricate clearance; only `Cleared` unlocks the proposal path.
- `Held` or `Pending` must surface a clear lock reason for Agent Chief Lord / operators.
- No automated outreach, email, or external API calls.
