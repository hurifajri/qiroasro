# Qiroasro

<p align="center">
  <strong>A comprehensive interactive platform for learning Tajweed and Quranic recitation — from Makharijul Huruf and Sifatul Huruf to full Tajweed rules.</strong><br>
  Built for the Ummah — source-available (non-commercial), free for educational use, and privacy-conscious.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="CONTRIBUTING.md">Contributing</a> •
  <a href="SECURITY.md">Security</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/actions/workflow/status/hurifajri/qiroasro/check.yml?branch=main&label=Checks&logo=github" alt="Build Status" />
  <img src="https://img.shields.io/badge/License-PolyForm%20Noncommercial-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss" alt="Tailwind CSS" />
</p>

---

## About Qiroasro

**Qiroasro** is a comprehensive, gamified learning platform designed to make mastering **Tajweed and Quranic recitation** engaging, structured, and intuitive. Starting from foundational Arabic phonetics (*Makharijul Huruf* and *Sifatul Huruf*) to broader *Tajweed* rules and recitation mastery, Qiroasro combines interactive relationship graphs, structured curriculum tracks, bite-sized practice quizzes, and gamified progression (quests, streaks, XP, and rankings) to help learners build lasting fluency.

---

## Features

- **🕸️ Interactive Letter & Phonetics Graph (Playground)**
  - Explore visual nodes and connections linking Arabic letters to articulation areas (*Halq*, *Lisan*, *Syafatain*, *Jauf*, *Khaisyum*) and articulation points (*makhraj*).
  - Inspect detailed letter attributes (*Hamas*, *Jahr*, *Syiddah*, *Rikhawah*, *Isti'la*, *Itbaq*, *Qalqalah*, and more).
  - High-performance, touch-friendly canvas powered by React Flow with custom floating edges and handles.

- **🎯 Interactive Practice & Challenge Modes**
  - Test knowledge of letter articulations and traits with customizable quiz settings.
  - Timed challenges, instant feedback, scoring analysis, and visual answer reviews.
  - Interactive onboarding tour for new learners.

- **📚 Structured Tajweed Curriculum & Gamified Progression**
  - Section-based progression tracks to systematically master *Tajweed*, *Makharijul Huruf*, and *Sifatul Huruf* from fundamentals to advanced levels.
  - Gamified learning mechanics—including quests, streaks, achievements, and rankings—to keep daily practice consistent and motivating.

- **🌍 Multi-language & Localization (i18n)**
  - Full interface and content localization across 5 languages:
    - 🇮🇩 Indonesian (`id`)
    - 🇺🇸 English (`en`)
    - 🇸🇦 Arabic (`ar` - with native RTL layout support)
    - 🇲🇾 Malay (`ms`)
    - 🇹🇷 Turkish (`tr`)

- **🎨 Modern, Clean & Accessible UI**
  - Responsive design optimized for mobile, tablet, and desktop viewports.
  - Dark mode and light mode theming.
  - WCAG-compliant accessibility with visible focus rings and semantic structure.

---

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React Server Components)
- **UI & Styling:** [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Motion](https://motion.dev/)
- **Graph & Visualization:** [@xyflow/react](https://reactflow.dev/) (React Flow)
- **Internationalization:** [next-intl](https://next-intl.dev/)
- **State Management & Querying:** [Zustand](https://zustand.docs.pmnd.rs/), [TanStack Query v5](https://tanstack.com/query)
- **Authentication & Database:** [Better Auth](https://www.better-auth.com/), [Drizzle ORM](https://orm.drizzle.team/), PostgreSQL
- **Validation & Tooling:** [Valibot](https://valibot.dev/), [Biome](https://biomejs.dev/)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `>= 20` (v24 recommended)
- [pnpm](https://pnpm.io/) `>= 10`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hurifajri/qiroasro.git
   cd qiroasro
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your PostgreSQL database credentials and OAuth keys in `.env.local`.

4. **Start the development server:**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Start Next.js development server on port 3000 |
| `pnpm build` | Build optimized production bundle |
| `pnpm start` | Run production server |
| `pnpm check` | Run Biome linter and formatter check |
| `pnpm fix` | Automatically fix Biome linting and formatting issues |
| `pnpm check:types` | Run strict TypeScript compiler verification without emitting |

---

## Contributing

Contributions from the community are warmly welcomed! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) guide for details on branch workflows, commit message conventions (Conventional Commits), and local quality checks.

---

## Security

If you discover a security vulnerability, please review our [Security Policy](SECURITY.md) and report it privately via GitHub Private Vulnerability Reporting.

---

## License

This project is **source-available (non-commercial)** and licensed under the **PolyForm Noncommercial License 1.0.0**. See the [LICENSE](LICENSE) file for complete details. Free for personal, educational, and non-commercial community use.
