# Self-hosted runner setup — for platform/IT

This is what's needed to make `.github/workflows/agentic-doc-sync.selfhosted.yml`
actually runnable. It's a request/spec you can hand to whoever provisions
infrastructure — nothing here requires flamingo-repo-specific knowledge.

## Why this is needed

The DH internal LiteLLM gateway (`http://localhost:36253`) that some Figma
plugins in `rider-design` already use (see `moxy`, `migrate-to-litellm`) is
only reachable via the `dp-devinf` localhost tunnel on a machine where that
tunnel is active — a normal hosted GitHub Actions runner (`ubuntu-latest`)
cannot reach it. This workflow needs its own runner on a machine that has
that tunnel running, as an alternative to paying for direct Anthropic API
credit.

## What to provision

1. **A machine/VM with the `dp-devinf` tunnel active** — same requirement
   already documented for DH employees using `moxy`
   (`figma-plugins/moxy/README.md` in `rider-design`: "Make sure the DH
   LiteLLM tunnel (dp-devinf) is running locally"). Whoever administers that
   tunnel/gateway internally is the right person to confirm whether a
   long-running service account or CI-dedicated machine can run it
   persistently (as opposed to a developer's personal laptop, which won't be
   reliably online for a nightly cron).
2. **Register it as a GitHub Actions self-hosted runner** on the
   `domdestefano/flamingo` repo (or an org-level runner, if this pattern
   gets reused elsewhere), with the label `dh-litellm` — that's the exact
   label `agentic-doc-sync.selfhosted.yml`'s `runs-on: [self-hosted,
   dh-litellm]` expects. Standard GitHub docs:
   Settings → Actions → Runners → New self-hosted runner.
3. **Software on that runner**: Node.js 20+, `git`, network access to both
   GitHub and `localhost:36253` on the same machine. No other flamingo-repo
   dependencies — `npm install -g @anthropic-ai/claude-code` happens inside
   the workflow itself.
4. **Uptime expectations**: this workflow is meant to run nightly (once
   infra exists, its schedule should mirror `agentic-doc-sync.yml`) plus
   on-demand — the runner (and the tunnel on it) needs to be up at those
   times, not just when someone happens to be at their desk.

## After the runner exists — do NOT skip this

The workflow currently only allows `workflow_dispatch` (manual) on purpose.
Before trusting it on a schedule:

1. Manually run it once via the Actions tab and confirm the job actually
   reaches Claude Code and gets a response (not just that the runner picks
   up the job).
2. Specifically verify a **tool call** works end-to-end — e.g. that the
   agent successfully calls `mcp__figma__get_figma_data` and gets real data
   back, and that a `Bash` tool call (like `npm run build` inside the
   prompt's Step 5) actually executes. This is the part
   `.github/scripts/anthropic-to-litellm-proxy.js` is most likely to get
   wrong (see the caveats at the top of that file) — Anthropic's and
   OpenAI's tool-calling formats differ, and the proxy currently does only a
   best-effort conversion, not a verified one.
3. Only after both of those pass, add `schedule` and `pull_request` (merged
   into `main`) triggers to this file, matching `agentic-doc-sync.yml`, and
   remove/disable the `ANTHROPIC_API_KEY`-based workflow so the sync doesn't
   run twice.
