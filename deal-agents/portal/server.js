// Studex Partner Deal Portal — internal draft. No deps. Basic-auth protected.
// Set PORTAL_USER / PORTAL_PASS env vars (no secrets in code). Server refuses to start without them.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URLSearchParams } = require('url');
const { runPipeline, SCREENING } = require('../lib/pipeline');

const U = process.env.PORTAL_USER;
const P = process.env.PORTAL_PASS;
if (!U || !P) {
  console.error('Set PORTAL_USER and PORTAL_PASS');
  process.exit(1);
}

const dataDir = path.join(__dirname, 'data');
const DB = path.join(dataDir, 'submissions.json');
fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(DB)) fs.writeFileSync(DB, '[]');

const load = () => JSON.parse(fs.readFileSync(DB, 'utf8'));
const save = (d) => fs.writeFileSync(DB, JSON.stringify(d, null, 2));
const esc = (s) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const page = (t, b) =>
  `<!doctype html><meta charset=utf-8><title>${t}</title><style>body{font-family:sans-serif;max-width:900px;margin:2em auto}label{display:block;margin:.6em 0}input,textarea,select{width:100%}pre{white-space:pre-wrap;background:#f4f4f4;padding:1em}.b{background:#fee;padding:.3em}</style><p class=b>PRIVATE DRAFT — internal only. Nothing is sent to partners.</p><nav><a href=/>Intake form</a> | <a href=/queue>Review queue</a></nav><h1>${t}</h1>${b}`;

const F = [
  ['company', 'Company'],
  ['country', 'Country of registration'],
  ['contacts', 'Contacts (name, role, email)'],
  ['owners', 'Directors / beneficial owners'],
  ['offer', 'What you offer'],
  ['want', 'What you want from Studex'],
  ['targets', 'Target African countries'],
  ['timeline', 'Timelines'],
  ['budget', 'Budget range'],
  ['docs', 'Documents (links / list)'],
];

const form = () =>
  page(
    'Studex Partner Intake',
    `<form method=post action=/submit>${F.map(([k, l]) => `<label>${l}<textarea name=${k} rows=2 required></textarea></label>`).join('')}<button>Submit</button></form><p><small>Document upload is stubbed: provide links. Use fictional example data in public demos.</small></p>`
  );

function applyPipelineToSubmission(s) {
  const result = runPipeline(s, {
    templatePath: path.join(__dirname, 'proposal-template.md'),
  });
  s.pipelineLocked = result.locked;
  s.proposal = result.proposalMarkdown || '';
  s.proposalStatus = result.locked ? 'LOCKED' : result.proposalStatus || 'DRAFT';
  s.strategy = result.strategy || null;
  s.localization = result.localization || null;
  s.executionPlan = result.executionPlan || null;
  s.lastPipelineRun = new Date().toISOString();
  return result;
}

const auth = (r) => {
  const h = r.headers.authorization || '';
  const [, b64] = h.split(' ');
  const [u, p] = Buffer.from(b64 || '', 'base64').toString().split(':');
  return u === U && p === P;
};

const body = (r) =>
  new Promise((ok) => {
    let d = '';
    r.on('data', (c) => (d += c));
    r.on('end', () => ok(Object.fromEntries(new URLSearchParams(d))));
  });

http
  .createServer(async (q, r) => {
    if (!auth(q)) {
      r.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Studex"' });
      return r.end('Auth required');
    }
    const send = (h) => {
      r.writeHead(200, { 'Content-Type': 'text/html' });
      r.end(h);
    };
    const go = (l) => {
      r.writeHead(303, { Location: l });
      r.end();
    };
    const u = new URL(q.url, 'http://x');

    if (q.method === 'GET' && u.pathname === '/') return send(form());

    if (q.method === 'POST' && u.pathname === '/submit') {
      const f = await body(q);
      const d = load();
      const s = {
        id: Date.now().toString(36),
        created: new Date().toISOString(),
        ...Object.fromEntries(F.map(([k]) => [k, f[k] || ''])),
        screening: 'Pending',
        screenNote: 'Pending sanctions/KYC screen',
        proposalStatus: 'LOCKED',
        approved: false,
      };
      applyPipelineToSubmission(s);
      d.push(s);
      save(d);
      return send(page('Thank you', '<p>Submission received. Studex will review it.</p>'));
    }

    if (q.method === 'GET' && u.pathname === '/queue') {
      const d = load();
      return send(
        page(
          'Internal review queue',
          `<table border=1 cellpadding=4><tr><th>Company</th><th>Screening</th><th>Proposal</th><th></th></tr>${d
            .map(
              (s) =>
                `<tr><td>${esc(s.company)}</td><td>${s.screening}</td><td>${s.approved ? 'APPROVED (not sent)' : esc(s.proposalStatus || 'DRAFT')}</td><td><a href=/item?id=${s.id}>open</a></td></tr>`
            )
            .join('')}</table>`
        )
      );
    }

    if (q.method === 'GET' && u.pathname === '/item') {
      const s = load().find((x) => x.id === u.searchParams.get('id'));
      if (!s) return send(page('Not found', ''));
      const det = F.map(([k, l]) => `<b>${l}:</b> ${esc(s[k])}<br>`).join('');
      const scr = `<form method=post action=/screen?id=${s.id}><b>Screening status (Robusca):</b> <select name=screening>${SCREENING.map(
        (o) => `<option ${o === s.screening ? 'selected' : ''}>${o}</option>`
      ).join('')}</select><input name=by placeholder="Screened by" style=width:30%><button>Update</button></form>`;

      let prop = '';
      if (s.screening === 'Cleared') {
        prop = `<h2>Draft proposal (${s.approved ? 'APPROVED — manual send only, never auto-sent' : 'DRAFT'})</h2><pre>${esc(s.proposal)}</pre>`;
        if (!s.approved) {
          prop += `<form method=post action=/approve?id=${s.id}><button>Approve (Agent Chief Lord)</button></form>`;
        } else if (s.executionPlan) {
          prop += `<h3>Execution plan (post-approval)</h3><pre>${esc(JSON.stringify(s.executionPlan, null, 2))}</pre>`;
        }
      } else {
        prop = `<h2>Proposal LOCKED</h2><p>Locked until screening = Cleared. Current: ${s.screening}.</p>`;
      }

      return send(
        page(
          esc(s.company),
          det +
            '<hr>' +
            scr +
            (s.screenedBy ? `<small>Last screened by ${esc(s.screenedBy)} at ${s.screenedAt}</small>` : '') +
            prop
        )
      );
    }

    if (q.method === 'POST' && u.pathname === '/screen') {
      const f = await body(q);
      const d = load();
      const s = d.find((x) => x.id === u.searchParams.get('id'));
      if (s && SCREENING.includes(f.screening)) {
        s.screening = f.screening;
        s.screenedBy = f.by;
        s.screenedAt = new Date().toISOString();
        if (f.screening !== 'Cleared') s.approved = false;
        applyPipelineToSubmission(s);
        save(d);
      }
      return go('/item?id=' + u.searchParams.get('id'));
    }

    if (q.method === 'POST' && u.pathname === '/approve') {
      const d = load();
      const s = d.find((x) => x.id === u.searchParams.get('id'));
      if (s && s.screening === 'Cleared') {
        s.approved = true;
        s.approvedAt = new Date().toISOString();
        applyPipelineToSubmission(s);
        save(d);
      }
      return go('/item?id=' + u.searchParams.get('id'));
    }

    r.writeHead(404);
    r.end();
  })
  .listen(process.env.PORT || 3000, '127.0.0.1', () =>
    console.log('Portal on http://127.0.0.1:' + (process.env.PORT || 3000))
  );
