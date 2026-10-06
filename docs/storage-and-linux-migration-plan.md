# Storage, model and Linux migration plan

## Current inventory

- Internal MacBook data volume: approximately 15 GiB free. It is the urgent
  performance constraint.
- `/Volumes/Models-House`: approximately 893 GiB free on a 955 GiB partition.
  It already contains about 14 GiB under `ollama-root/models` and about 1.3 GiB
  of Hugging Face data.
- `/Volumes/ISOs`: approximately 893 GiB free on a second 955 GiB partition.
- `/Volumes/LinuxVM`: a 93 GiB partition with a `VMs` directory.
- `/Volumes/NO NAME`: a 29 GiB removable USB containing SanDisk installer files;
  it is not the 1 TB model drive.
- Current UTM bundle: `OpenClaw-Ubuntu.utm` is approximately 2.7 GiB, mostly an
  Ubuntu ARM64 installer ISO.

## Reversible first move

After confirming the external volume is writable and the applications are
stopped, copy and verify these directories to `Models-House`, then replace them
with symlinks only after a successful checksum/size comparison:

| Source | Approx. size | Destination |
|---|---:|---|
| `~/.cache/huggingface` | 6.8 GB | `/Volumes/Models-House/cache/huggingface` |
| `~/.cache/uv` | 2.1 GB | `/Volumes/Models-House/cache/uv` |
| `~/.cache/codex-runtimes` | 1.5 GB | `/Volumes/Models-House/cache/codex-runtimes` |
| UTM Ubuntu installer ISO | 2.7 GB | `/Volumes/ISOs/ubuntu/` |

This recovers roughly 13 GB without deleting durable memory, credentials,
repositories or model manifests. The cache reset job must be updated to follow
the new locations and continue removing only stale disposable files.

## Model-house layout

Use the 1 TB partition for durable model artifacts and per-runtime caches:

```text
/Volumes/Models-House/
  manifests/          # model IDs, licenses, checksums, runtimes
  ollama-root/models/  # Ollama blobs
  mlx/                 # MLX safetensors/quantized weights
  gguf/                # llama.cpp/GGUF weights
  huggingface/         # verified HF cache
  cache/               # disposable package/runtime caches
  staging/             # downloads before checksum verification
```

Do not run inference directly from Google Drive. Drive can store manifests,
reports, source archives and a backup copy of selected weights. Active weights
should be local to the execution host or attached SSD for predictable latency.

## Linux VM capacity

The existing 93 GiB `LinuxVM` partition is suitable for a small control VM,
Docker layers and a lightweight agent gateway. It is not suitable for a large
model warehouse. A 400 GB Linux VM should be a sparse qcow2 disk stored on
`Models-House`, or a new dedicated external partition after a backup. A sparse
disk consumes only the blocks actually used, so it does not immediately reserve
400 GB.

Recommended first Linux VM allocation:

- 80–120 GB OS, containers and active worktrees
- 150–250 GB model cache, depending on the Mac mini's memory
- remainder for logs and temporary builds

Keep one local copy per execution host. Symlinks work within one Mac, but cannot
make a Mac mini read a MacBook path. For the Mac mini, use a second attached SSD
with the same directory layout and synchronize manifests/checksums, not live VM
disks over Google Drive.

## USB flashing gate

The 29 GiB `NO NAME` device must not be flashed until its physical disk identity
is confirmed with `diskutil info`, the exact Linux image is selected, and the
contents are backed up. Flashing erases that device. The preferred first image
for an Apple-silicon VM is Ubuntu 24.04 ARM64; bare-metal boot support must be
validated separately for the target Mac.
