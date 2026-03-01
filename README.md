# Skill Evolver (Fork)

Analytics and health monitoring for Claude Code skills. Like Google Analytics for your skills — tracks usage, detects user reactions, monitors health trends, and enables A/B testing. All data stays local in SQLite.

> **Fork changes:** Per-project database isolation — each project gets its own metrics DB, keyed by `git remote`. Enables multi-project teams without metrics mixing.

Upstream: [haidang1810/skill-evolver](https://github.com/haidang1810/skill-evolver)

## Install

```bash
claude plugin marketplace add https://github.com/duypk-apero/skill-evolver
claude plugin install skill-evolver

# Update
claude plugin marketplace update skill-evolver
claude plugin uninstall skill-evolver
claude plugin install skill-evolver
```

## Features

- **Usage Tracking** — auto-captures skill invocations, tokens, duration, model
- **Reaction Detection** — classifies user response: satisfied, correction, follow-up, retry, cancel
- **Health Monitoring** — alerts on satisfaction drops >15%, token bloat >30%, cancel >10%
- **Correction Clustering** — TF-IDF keyword analysis of correction messages
- **Version Tracking** — auto-snapshots SKILL.md with per-version metrics
- **Skill Guards** — blocks edits exceeding 500 lines, >30% growth, >3 step variance
- **A/B Testing** — 50/50 random assignment, min 20 runs for significance
- **Per-Project Isolation** — separate SQLite DB per git remote (fork feature)

## Commands

| Command | Purpose |
|---------|---------|
| `/skill-stats` | Usage overview |
| `/skill-stats <name>` | Single skill deep dive |
| `/skill-health` | Health alerts |
| `/skill-corrections <name>` | Correction patterns |
| `/skill-history <name>` | Version timeline |
| `/skill-rollback <name>` | Restore previous version |
| `/skill-compare <name>` | Side-by-side version diff |
| `/skill-ab start <name> <path>` | Start A/B test |
| `/skill-ab status` | Active tests |
| `/skill-ab result <name>` | Test outcome |
| `/skill-export <name>` | CSV/JSON export |

## Per-Project Isolation (Fork Feature)

Each project gets its own DB automatically:

```
~/.claude/plugins/.../data/
├── skill-evolver-3a7f2b1c.db   ← project A (from git remote hash)
├── skill-evolver-8e4d9f02.db   ← project B
└── skill-evolver-c1a5b7e3.db   ← project C (CWD fallback if no git)
```

No config needed. Works for teams with multiple projects.

## Design Philosophy

1. **Data-driven** — regex + TF-IDF, no LLM for analysis
2. **Human-in-the-loop** — data reveals patterns, you decide changes
3. **Zero config** — install and tracking starts automatically
4. **Privacy-first** — local SQLite only, zero telemetry
5. **Minimal overhead** — async hooks, <100ms

## Tech Stack

Node.js (ESM) · SQLite (better-sqlite3) · TF-IDF (built-in) · SHA-256 hashing

## License

MIT
