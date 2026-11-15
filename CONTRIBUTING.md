# Contributing to Qiroasro

Thank you for your interest in contributing to **Qiroasro**! This project is a source-available (non-commercial), interactive web application designed to help Muslims learn and master *Tajweed*, *makharijul huruf* (articulation points), phonetic traits (*sifatul huruf*), and Quranic recitation. Every contribution — whether reporting a bug, proposing features, verifying phonetics/tajweed content, or contributing code — is a valuable community service (*amal jariyah*).

---

## Table of Contents

- [Code of Conduct & Etiquette](#code-of-conduct--etiquette)
- [How Can You Contribute?](#how-can-you-contribute)
  - [1. Reporting Bugs & Proposing Features](#1-reporting-bugs--proposing-features)
  - [2. Islamic & Tajweed Content Verification](#2-islamic--tajweed-content-verification)
  - [3. Code & UI Improvements](#3-code--ui-improvements)
- [Development Workflow](#development-workflow)
  - [Branching Strategy](#branching-strategy)
  - [Commit Message Standards](#commit-message-standards)
  - [Local Testing & Quality Checks](#local-testing--quality-checks)
- [Pull Request Checklist](#pull-request-checklist)
- [Automated Releases (Release Please)](#automated-releases-release-please)

---

## Code of Conduct & Etiquette

We strive to maintain an open, welcoming, and respectful environment. In the spirit of Islamic brotherhood and collaboration:
- Communicate with patience, kindness, and mutual respect.
- When discussing Quranic recitation, *makharijul huruf*, or *sifatul huruf*, prioritize verified scholarly sources (e.g., *Al-Muqaddimah Al-Jazariyyah*, credible classical/modern tajweed authorities) over personal opinion.
- Constructive technical discussions and design feedback are always encouraged.

---

## How Can You Contribute?

### 1. Reporting Bugs & Proposing Features
- Check existing [GitHub Issues](https://github.com/hurifajri/qiroasro/issues) first to avoid duplicate reports.
- If reporting a bug, please include:
  - Clear steps to reproduce the issue.
  - Browser, OS, and device environment (e.g., Chrome on macOS, Safari on iOS).
  - Screenshots or browser console logs if relevant.
- If proposing a feature, explain how it benefits learners while keeping the interface focused and intuitive.

### 2. Islamic & Tajweed Content Verification
Accurate transmission of Arabic articulation and tajweed rules is paramount. You do not need to be a developer to help:
- Spotted an inaccurate articulation point description or diagram?
- Found a mistake in letter attributes (*hamas*, *jahr*, *isti'la*, *qalqalah*, etc.)?
- Have suggestions for clearer explanations in Indonesian, English, Arabic, Malay, or Turkish?

Feel free to open a [GitHub Issue](https://github.com/hurifajri/qiroasro/issues/new) citing the letter, trait, and scholarly reference.

### 3. Code & UI Improvements
- Pick up an open issue or suggest an improvement (accessibility, graph performance, animations, localization).
- Read the [Development Workflow](#development-workflow) below before starting work.

---

## Development Workflow

### Branching Strategy

- `main` is our primary stable branch. Every pull request merged to `main` must pass automated CI checks.
- Create short-lived feature or fix branches from `main`:
  ```bash
  git switch main
  git pull origin main
  git switch -c feat/your-feature-name
  ```
- Use descriptive branch prefixes:
  - `feat/*` — new features or major enhancements
  - `fix/*` — bug fixes
  - `docs/*` — documentation updates
  - `chore/*` — maintenance, dependencies, or tool configurations

### Commit Message Standards ([Conventional Commits](https://www.conventionalcommits.org))

Commit messages must follow the format `<type>(<scope>)?: <subject>`, enforced locally via **Husky** + **Commitlint** and on GitHub Actions CI.

| Type | Release Version Bump | Included in Changelog? | Description |
| :--- | :---: | :---: | :--- |
| `feat` | **Minor** (`0.x.0`) | Yes | New user-facing feature |
| `fix` | **Patch** (`0.0.x`) | Yes | Bug fix for users |
| `perf`, `revert` | None | Yes | Performance enhancement or commit revert |
| `refactor`, `docs`, `style`, `test`, `build`, `ci`, `chore` | None | No | Code refactoring, documentation, tests, tooling |
| `!` after type (e.g. `feat!:`) or `BREAKING CHANGE:` | **Major** (`x.0.0`) | Yes | Breaking API or compatibility change |

*Examples:*
- `feat(graph): optimize node interaction on mobile touch`
- `fix(locale): restore locale routing export`
- `docs(readme): add environment setup guide`

### Local Testing & Quality Checks

All commands use **pnpm**:

```bash
# Check code style, formatting (Biome), and type checking
pnpm check
pnpm check:types

# Auto-fix linting and formatting issues
pnpm fix

# Build production bundle
pnpm build
```

---

## Pull Request Checklist

Before opening or requesting a review on a PR:
- [ ] Code adheres to Biome linting and formatting (`pnpm check`).
- [ ] Strict TypeScript checks pass without errors (`pnpm check:types`).
- [ ] Next.js production build succeeds (`pnpm build`).
- [ ] All commit messages and PR titles follow [Conventional Commits](https://www.conventionalcommits.org).
- [ ] No secrets, `.env` files, or proprietary assets are committed.

---

## Automated Releases (Release Please)

We use Google's **Release Please** action. When PRs adhering to Conventional Commits are merged to `main`, Release Please automatically maintains a Release PR with updated versions and `CHANGELOG.md`. Merging that Release PR creates a GitHub Release and tag automatically.
