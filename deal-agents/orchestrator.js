#!/usr/bin/env node
/**
 * Deal Agent Team orchestrator — runs agents in order per agents/*.md specs.
 * Usage: node orchestrator.js [path/to/intake.json]
 */
const fs = require('fs');
const path = require('path');
const { runPipeline } = require('./lib/pipeline');

const defaultExample = path.join(__dirname, 'examples', 'partner-intake.example.json');
const intakePath = process.argv[2] ? path.resolve(process.argv[2]) : defaultExample;

if (!fs.existsSync(intakePath)) {
  console.error('Intake file not found:', intakePath);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(intakePath, 'utf8'));
const result = runPipeline(raw);

const outDir = process.env.DEAL_AGENTS_OUT || path.join(__dirname, 'data', 'runs');
fs.mkdirSync(outDir, { recursive: true });
const runId = result.normalizedIntake.id;
const outFile = path.join(outDir, `${runId}.json`);
fs.writeFileSync(outFile, JSON.stringify(result, null, 2));

console.log('Deal Agent Team — run complete');
console.log('  Intake id:', runId);
console.log('  Screening:', result.normalizedIntake.screening);
console.log('  Locked:', result.locked);
console.log('  Approved:', result.normalizedIntake.approved);
if (result.proposalMarkdown) {
  console.log('  Proposal: generated (' + result.proposalStatus + ')');
} else {
  console.log('  Proposal: not generated (compliance lock)');
}
if (result.executionPlan) {
  console.log('  Execution tasks:', result.executionPlan.tasks.length);
} else {
  console.log('  Execution plan: skipped (approval required)');
}
console.log('  Artifact:', outFile);

if (result.locked) {
  process.exit(0);
}

process.exit(0);
