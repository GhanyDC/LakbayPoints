# Git Workflow and Commit Discipline

## Goal

Every meaningful change must be committed properly so the team can track progress, revert safely, and show disciplined development.

## Branch Strategy

Use one main branch and feature branches.

```txt
main
feature/repo-setup
feature/mobile-route-comparison
feature/classifier
feature/rewards
feature/report-access-barrier
feature/dashboard
feature/presentation-polish
```

## Commit Frequency

Commit after every complete logical change.

Do not commit broken code unless using a WIP branch and clearly labeled WIP commit.

## Commit Message Format

Use Conventional Commits:

```txt
feat: add route comparison screen
fix: correct classifier threshold logic
docs: add MVP scope document
test: add valid trace classifier test
chore: configure monorepo workspace
refactor: move shared types to package
style: polish route card layout
```

## Required Commit Practices

Before every commit:
1. Run formatting.
2. Run linting, if available.
3. Run tests, if available.
4. Check that the app still starts.
5. Update `docs/progress-tracker.md`.

## Pull Request / Review Checklist

Before merging:
- Does this match the MVP scope?
- Did we avoid adding non-MVP features?
- Is terminology consistent?
- Are screenshots or demo notes updated if UI changed?
- Are docs updated?
- Are tests added where useful?
- Does the demo flow still work?

## Codex Instruction

Every Codex task should end with:

> After implementation, summarize changed files, recommended tests, and proposed commit message. Do not create unrelated features outside the MVP scope.

## Sample Commit Plan

### Initial setup

```bash
git checkout -b feature/repo-setup
git add .
git commit -m "chore: set up lakbaypoints mvp monorepo"
```

### Add docs

```bash
git add docs README.md
git commit -m "docs: add mvp planning documents"
```

### Add classifier

```bash
git checkout -b feature/classifier
git add packages/shared data/traces docs/classifier-rules.md
git commit -m "feat: add sustainable trip chain classifier"
```
