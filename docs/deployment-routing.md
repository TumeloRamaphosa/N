# Deployment routing

Route work to the right deployment-team agent:

| Platform | Scope |
|----------|--------|
| **Cloudflare** | DNS, Workers, Pages, edge/security, R2 |
| **Vercel** | Web apps, Next.js sites, previews |
| **GCP** | VMs, databases, storage, GPU/heavy compute, private model hosting |

Every live deploy, DNS change or spend needs Agent Chief Lord approval before execution.
