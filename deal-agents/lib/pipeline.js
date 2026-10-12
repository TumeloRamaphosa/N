const fs = require('fs');
const path = require('path');

const SCREENING = ['Pending', 'Cleared', 'Held'];

function trim(s) {
  return String(s ?? '').trim();
}

function parseCountries(targets) {
  const raw = trim(targets);
  if (!raw) return [];
  return raw
    .split(/[,;\n]+/)
    .map((c) => c.trim())
    .filter(Boolean);
}

/** @typedef {import('./types')} - intake shape implied by portal */

function intakeAgent(raw) {
  const normalizedIntake = {
    id: trim(raw.id) || `ex-${Date.now().toString(36)}`,
    created: raw.created || new Date().toISOString(),
    company: trim(raw.company),
    country: trim(raw.country),
    contacts: trim(raw.contacts),
    owners: trim(raw.owners),
    offer: trim(raw.offer),
    want: trim(raw.want),
    targets: trim(raw.targets),
    targetCountries: parseCountries(raw.targets),
    timeline: trim(raw.timeline),
    budget: trim(raw.budget),
    docs: trim(raw.docs),
    screening: SCREENING.includes(raw.screening) ? raw.screening : 'Pending',
    screenNote: trim(raw.screenNote) || 'Pending sanctions/KYC screen',
    screenedBy: trim(raw.screenedBy),
    screenedAt: raw.screenedAt,
    approved: Boolean(raw.approved),
    approvedAt: raw.approvedAt,
  };

  const warnings = [];
  for (const field of ['company', 'country', 'offer', 'want', 'targets']) {
    if (!normalizedIntake[field]) warnings.push(`Missing or empty: ${field}`);
  }

  return {
    agent: '01-intake-agent',
    normalizedIntake,
    validation: { ok: warnings.length === 0, warnings },
  };
}

function complianceGate(normalizedIntake) {
  const status = normalizedIntake.screening;
  const cleared = status === 'Cleared';
  const message = cleared
    ? 'Robusca clearance on file; proposal path unlocked.'
    : `Proposal LOCKED until screening = Cleared. Current: ${status}.`;

  return {
    agent: '02-compliance-gate',
    compliance: { status, cleared, message },
    pipelineLocked: !cleared,
  };
}

function strategyAgent(normalizedIntake) {
  const countries = normalizedIntake.targetCountries.length
    ? normalizedIntake.targetCountries
    : ['[TBD country]'];
  const pilotCountry = countries[0];

  const operatingModel =
    normalizedIntake.want.toLowerCase().includes('pilot')
      ? 'pilot'
      : normalizedIntake.want.toLowerCase().includes('resell')
        ? 'reseller'
        : 'referral / pilot (confirm with Agent Chief Lord)';

  return {
    agent: '03-strategy-agent',
    strategy: {
      operatingModel,
      partnerBrings: [normalizedIntake.offer || '[TBD]'],
      studexBrings: [
        'Africa market navigation and partner introductions',
        'Delivery coordination with vetted local operators',
        'Regulatory and localization playbook (non-legal summary)',
      ],
      africaApproach:
        'Land in one pilot country with a bounded scope, then expand to secondary targets after operational learnings.',
      pilotCountry,
      rationale: `Start in ${pilotCountry} where partner interest and stated targets align; validate payments and support model before scale.`,
    },
  };
}

function localizationAgent(normalizedIntake, strategy) {
  const pilot = strategy.pilotCountry;
  const genericSteps = (country) => [
    `Confirm entity or partner structure for ${country} [TBD legal review]`,
    `Map licensing / sector rules for offering: ${normalizedIntake.offer || '[TBD]'}`,
    'Payments: local currency settlement and mobile-money options [TBD provider]',
    'Language and support: define primary customer-facing language',
    'Data: residency and hosting constraints checklist',
    'Pilot customers: 1–3 named internal test accounts only (fictional examples)',
  ];

  const secondary = normalizedIntake.targetCountries
    .filter((c) => c !== pilot)
    .map((country) => ({ country, entrySteps: genericSteps(country) }));

  return {
    agent: '04-localization-agent',
    localization: {
      pilotCountry: pilot,
      entrySteps: genericSteps(pilot),
      secondaryMarkets: secondary,
    },
  };
}

function proposalWriter(normalizedIntake, strategy, localization, templatePath) {
  const tpl = fs.readFileSync(templatePath, 'utf8');
  const extra = `

## Agent strategy summary (internal)
- Operating model: ${strategy.operatingModel}
- Pilot country: ${strategy.pilotCountry}
- Studex brings: ${strategy.studexBrings.join('; ')}
- Partner brings: ${strategy.partnerBrings.join('; ')}

## Localization — ${localization.pilotCountry}
${localization.entrySteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
${localization.secondaryMarkets.length ? '\n### Secondary markets\n' + localization.secondaryMarkets.map((m) => `- **${m.country}**: ${m.entrySteps[0]}`).join('\n') : ''}
`;

  let proposalMarkdown = tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => normalizedIntake[k] || '[TBD]');
  proposalMarkdown += extra;

  return {
    agent: '05-proposal-writer',
    proposalMarkdown,
    proposalStatus: normalizedIntake.approved ? 'APPROVED (not sent)' : 'DRAFT',
  };
}

function executionPlanner(normalizedIntake, strategy) {
  if (!normalizedIntake.approved || normalizedIntake.screening !== 'Cleared') {
    return {
      agent: '06-execution-planner',
      skipped: true,
      reason: 'Execution plan runs only after Cleared + Agent Chief Lord approval.',
      executionPlan: null,
    };
  }

  return {
    agent: '06-execution-planner',
    skipped: false,
    executionPlan: {
      tasks: [
        {
          id: 't1',
          title: 'File Robusca clearance reference in internal deal folder',
          ownerRole: 'Compliance',
          dependsOn: [],
        },
        {
          id: 't2',
          title: `Schedule internal discovery session (no external send) — ${normalizedIntake.company}`,
          ownerRole: 'Deal desk',
          dependsOn: ['t1'],
        },
        {
          id: 't3',
          title: `Pilot kickoff checklist for ${strategy.pilotCountry}`,
          ownerRole: 'Africa localization',
          dependsOn: ['t2'],
        },
        {
          id: 't4',
          title: 'Draft term sheet for manual review; Chief Lord sign-off before any outreach',
          ownerRole: 'Legal liaison',
          dependsOn: ['t3'],
        },
      ],
    },
  };
}

/**
 * Run deal agent pipeline in order. Returns step artifacts and final state.
 */
function runPipeline(rawIntake, options = {}) {
  const templatePath =
    options.templatePath ||
    path.join(__dirname, '..', 'portal', 'proposal-template.md');

  const steps = [];
  const intakeOut = intakeAgent(rawIntake);
  steps.push(intakeOut);
  const ni = intakeOut.normalizedIntake;

  const complianceOut = complianceGate(ni);
  steps.push(complianceOut);

  if (complianceOut.pipelineLocked) {
    return {
      success: true,
      locked: true,
      normalizedIntake: ni,
      steps,
      proposalMarkdown: null,
      executionPlan: null,
    };
  }

  const strategyOut = strategyAgent(ni);
  steps.push(strategyOut);

  const locOut = localizationAgent(ni, strategyOut.strategy);
  steps.push(locOut);

  const propOut = proposalWriter(ni, strategyOut.strategy, locOut.localization, templatePath);
  steps.push(propOut);

  const execOut = executionPlanner(ni, strategyOut.strategy);
  steps.push(execOut);

  return {
    success: true,
    locked: false,
    normalizedIntake: ni,
    steps,
    strategy: strategyOut.strategy,
    localization: locOut.localization,
    proposalMarkdown: propOut.proposalMarkdown,
    proposalStatus: propOut.proposalStatus,
    executionPlan: execOut.executionPlan,
  };
}

module.exports = {
  runPipeline,
  intakeAgent,
  complianceGate,
  strategyAgent,
  localizationAgent,
  proposalWriter,
  executionPlanner,
  SCREENING,
};
