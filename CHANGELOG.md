# Changelog

## [0.4.0](https://github.com/hurifajri/qiroasro/compare/v0.3.1...v0.4.0) (2026-11-25)


### Features

* **gamification:** implement phase 1 gamification, quests, and profile stats ([#49](https://github.com/hurifajri/qiroasro/issues/49)) ([e026e20](https://github.com/hurifajri/qiroasro/commit/e026e2032c890e25ab697fcfc120bd57b7d4d9d7))
* **home:** build interactive landing page and extract shared node components ([#54](https://github.com/hurifajri/qiroasro/issues/54)) ([2956841](https://github.com/hurifajri/qiroasro/commit/29568416b0c933184e35493aaf49eff421110394))
* **practice:** implement phase 3 learn quiz bank and adaptive practice ([#52](https://github.com/hurifajri/qiroasro/issues/52)) ([a60aca9](https://github.com/hurifajri/qiroasro/commit/a60aca9e2fc81a1d1421490e4a9b882957b9b907))
* **reference:** implement phase 2 reference data and simplify camelCase schemas ([#51](https://github.com/hurifajri/qiroasro/issues/51)) ([1354e76](https://github.com/hurifajri/qiroasro/commit/1354e7659e133d990f18d76a4d4d0fe9c39ec861))
* **social:** implement phase 4 leaderboard cohorts and user follows ([#53](https://github.com/hurifajri/qiroasro/issues/53)) ([afd46f0](https://github.com/hurifajri/qiroasro/commit/afd46f07d33a2beaf4ab658e1a4ed416c976a17b))

## [0.3.1](https://github.com/hurifajri/qiroasro/compare/v0.3.0...v0.3.1) (2026-11-22)


### Bug Fixes

* **playground:** disable pan/zoom and enforce single detail filter in mobile all view ([#43](https://github.com/hurifajri/qiroasro/issues/43)) ([36f39c3](https://github.com/hurifajri/qiroasro/commit/36f39c32d17e9f9272b1aa57a4a8f0b256df3230))
* **playground:** expand panels and reset filters when starting tour ([#39](https://github.com/hurifajri/qiroasro/issues/39)) ([115516d](https://github.com/hurifajri/qiroasro/commit/115516dfd0860477e55a8e8fb1e9469993306049))
* **playground:** hide traits and articulations by default in mobile all view ([#42](https://github.com/hurifajri/qiroasro/issues/42)) ([edb0347](https://github.com/hurifajri/qiroasro/commit/edb03475c8839f5d691cac199be0c0ee1fb6dca7))
* **playground:** optimize mobile canvas rendering and enable all view mode ([#41](https://github.com/hurifajri/qiroasro/issues/41)) ([ee5e4c2](https://github.com/hurifajri/qiroasro/commit/ee5e4c278b9489e41f2e96d347af8a7269435be6))
* **playground:** paint download loading state before exporting image ([#45](https://github.com/hurifajri/qiroasro/issues/45)) ([627886e](https://github.com/hurifajri/qiroasro/commit/627886e5fcd504d5fb7283dfd0a8bd010ddcc9b1))
* **playground:** resolve quiz, tour, filter bugs and optimize rendering ([#46](https://github.com/hurifajri/qiroasro/issues/46)) ([22c848c](https://github.com/hurifajri/qiroasro/commit/22c848cf9d38260dca249d6b44ad5f198e07779f))


### Performance Improvements

* **playground:** render graph edges on a single canvas ([#44](https://github.com/hurifajri/qiroasro/issues/44)) ([364a768](https://github.com/hurifajri/qiroasro/commit/364a768adfb7112cdc5592684e62bd825c68dd70))

## [0.3.0](https://github.com/hurifajri/qiroasro/compare/v0.2.0...v0.3.0) (2026-11-21)


### Features

* redesign database schema and enhance playground graph controls ([#37](https://github.com/hurifajri/qiroasro/issues/37)) ([2d0726a](https://github.com/hurifajri/qiroasro/commit/2d0726aeb59025f012fc12beeea6b883b64b1fa9))

## [0.2.0](https://github.com/hurifajri/qiroasro/compare/v0.1.0...v0.2.0) (2026-11-15)


### Features

* initialize Qiroasro app with interactive Makharij & Sifatul Huruf playground, quiz modes, waitlist, and i18n ([#1](https://github.com/hurifajri/qiroasro/issues/1)) ([15a1bdf](https://github.com/hurifajri/qiroasro/commit/15a1bdf8377165b14241801b2358464751fe4dd4))
* add Vercel Analytics and Speed Insights ([#2](https://github.com/hurifajri/qiroasro/issues/2)) ([a00d1da](https://github.com/hurifajri/qiroasro/commit/a00d1dad8a057d79bf8244d735758037ed72edc8))
* add Arabic and Malay locales with RTL support ([#16](https://github.com/hurifajri/qiroasro/issues/16)) ([cb5059d](https://github.com/hurifajri/qiroasro/commit/cb5059dd01341c7f4375b91814460f926d279d31))
* add authenticated learning path, practice, leaderboard, quests, and shop pages ([#21](https://github.com/hurifajri/qiroasro/issues/21)) ([d08cdae](https://github.com/hurifajri/qiroasro/commit/d08cdaeb37a24f4072e1ed77ec65495d41221651))
* add Better Auth authentication, user profiles, and account settings ([#22](https://github.com/hurifajri/qiroasro/issues/22)) ([6f328a3](https://github.com/hurifajri/qiroasro/commit/6f328a3b70916cfbf581cec2c279ac09a7769b1d))
* add tajweed reference pages with MDX support and curriculum progress tracking ([#23](https://github.com/hurifajri/qiroasro/issues/23)) ([33d40e7](https://github.com/hurifajri/qiroasro/commit/33d40e76df310858ffe6f79ebbaddc2e7f748f02))


### Bug Fixes

* fix quiz canvas height calculation, storage persistence, and selector hydration ([#3](https://github.com/hurifajri/qiroasro/issues/3)) ([0f0c1bc](https://github.com/hurifajri/qiroasro/commit/0f0c1bcdee44d45944ad367cb4ac91f8279e4353))
* fix quiz canvas theme background colors and instruction copy ([#5](https://github.com/hurifajri/qiroasro/issues/5)) ([ec8d26d](https://github.com/hurifajri/qiroasro/commit/ec8d26d229f19a1a091116f947e8cfc0d078af69))
* revert `React.memo` wrapping on playground graph nodes ([#7](https://github.com/hurifajri/qiroasro/issues/7)) ([facddec](https://github.com/hurifajri/qiroasro/commit/facddecc56ecd79c3408e1cf5d41a26309e61694))
* fix consent banner footer background and challenge results viewport height ([#11](https://github.com/hurifajri/qiroasro/issues/11)) ([a11af1b](https://github.com/hurifajri/qiroasro/commit/a11af1b3bf9ee6ef048c3170a1faaf78b6c034e9))
* use static `lastModified` date and simplify localized URLs in sitemap ([#12](https://github.com/hurifajri/qiroasro/issues/12)) ([ba46fbf](https://github.com/hurifajri/qiroasro/commit/ba46fbfec5ad7a8254b1cd83ad1996aacacf6959))
* defer playground tour until user responds to consent banner ([#14](https://github.com/hurifajri/qiroasro/issues/14)) ([fb70b6a](https://github.com/hurifajri/qiroasro/commit/fb70b6a920f1b2e03a28047681fbe70c7f229a26))
* fix badge sizing, stat alignment, and letter node text contrast in challenge analytics ([#19](https://github.com/hurifajri/qiroasro/issues/19)) ([f7f1062](https://github.com/hurifajri/qiroasro/commit/f7f1062614ea9421989d1d79f93c3a9367892f90))
* add mobile unsupported fallback and refine playground layout, tour, and header responsiveness ([#20](https://github.com/hurifajri/qiroasro/issues/20)) ([7778d8b](https://github.com/hurifajri/qiroasro/commit/7778d8b3247fc11f4dafb4993045276e9549a9c1))
* **ci:** specify pnpm version in packageManager ([#34](https://github.com/hurifajri/qiroasro/issues/34)) ([1898da0](https://github.com/hurifajri/qiroasro/commit/1898da0ff0e577e4eaf8c0837efd39839a17890c))


### Performance Improvements

* **quiz:** move dialog open tracking into Zustand store to reduce hook re-renders ([#4](https://github.com/hurifajri/qiroasro/issues/4)) ([c42df17](https://github.com/hurifajri/qiroasro/commit/c42df17b4b382e2d834aab685e3670bd3e715d72))
* **playground:** refactor quiz store and node components to reduce re-renders ([#6](https://github.com/hurifajri/qiroasro/issues/6)) ([aaa1143](https://github.com/hurifajri/qiroasro/commit/aaa11433659fe0fb695e85bc20e9ea965d12e8f9))
* **playground:** optimize graph edges and node layout, and configure Sentry error tracking ([#8](https://github.com/hurifajri/qiroasro/issues/8)) ([e8a0170](https://github.com/hurifajri/qiroasro/commit/e8a0170db949ec3647dd2fb3495818f78562725e))
* add static asset cache headers and refactor playground hooks, Drizzle schema, and challenge flow ([#15](https://github.com/hurifajri/qiroasro/issues/15)) ([d782117](https://github.com/hurifajri/qiroasro/commit/d782117215da2ab5ad337d0b62bd71ff4d09a187))
