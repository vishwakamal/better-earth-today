# CLAUDE.md — AI Assistant Guide for BetterEarthToday

## Project Overview

BetterEarthToday is an environmental awareness website focused on climate change, sustainability, and environmental education. It is a static, single-page React application deployed to GitHub Pages.

- **Deployment URL:** https://vishwakamal.github.io/better-earth-today
- **Creator:** Vishwa Kamalbabu

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | React 18.2 (functional components)  |
| Routing      | React Router DOM v6                 |
| Build        | Create React App (Webpack + Babel)  |
| Testing      | Jest + React Testing Library        |
| Linting      | ESLint (CRA defaults: `react-app`, `react-app/jest`) |
| Deployment   | GitHub Pages via `gh-pages` package |
| Styling      | Plain CSS (no preprocessor)         |

No TypeScript, no CSS-in-JS, no state management library, no backend/API.

## Project Structure

```
better-earth-today/
├── public/                  # Static assets (index.html, manifest, favicons)
├── src/
│   ├── index.js             # Entry point — renders <App /> in StrictMode
│   ├── App.js               # Root component with React Router setup
│   ├── App.css              # All application styles (single file)
│   ├── index.css            # Global body/code font styles
│   ├── App.test.js          # Placeholder test (CRA default)
│   ├── setupTests.js        # Jest setup — imports jest-dom matchers
│   ├── reportWebVitals.js   # Web Vitals reporting utility
│   ├── components/          # Shared layout components
│   │   ├── Header.js        # Navigation bar with route links
│   │   └── Footer.js        # Copyright footer
│   ├── Pages/               # Route-level page components
│   │   ├── HomePage.js      # Landing page with CTA
│   │   ├── AboutPage.js     # Team and mission info
│   │   └── CurrentNewsPage.js # Environmental news articles
│   └── Images/              # Image assets (jpeg/jpg)
│       ├── images1.jpeg
│       └── images2.jpg
├── package.json
└── package-lock.json
```

## Common Commands

```bash
# Start development server (localhost:3000, hot-reload)
npm start

# Run tests (Jest, interactive watch mode)
npm test

# Run tests once (CI mode)
CI=true npm test

# Production build to /build directory
npm run build

# Deploy to GitHub Pages (runs build first via predeploy)
npm run deploy
```

## Routing

Defined in `src/App.js` using React Router v6:

| Path            | Component          |
|-----------------|--------------------|
| `/home`         | `HomePage`         |
| `/about`        | `AboutPage`        |
| `/current-news` | `CurrentNewsPage`  |

Note: There is no root `/` redirect — navigating to `/` shows no page content (only header/footer). Navigation links are in `Header.js`.

## Code Conventions

### Components
- All components are **functional** (no class components).
- No React hooks are currently used (useState, useEffect, etc.) — components are purely presentational.
- Page-level components live in `src/Pages/` (capital P).
- Shared/layout components live in `src/components/` (lowercase c).
- Components use default exports.

### Styling
- All styles are in `src/App.css` (single file, ~115 lines).
- Class naming follows a BEM-like pattern: `.nav-button-link-home`, `.nav-button-link-about`.
- One responsive breakpoint at `max-width: 600px`.
- Colors: header uses `#333` dark gray; nav buttons use blue/red/green accent colors.

### Data
- All content is **hardcoded** directly in JSX — no data files, no API calls, no CMS.
- Images are imported from `src/Images/` via Webpack's asset handling.

## Testing

- Framework: Jest (bundled with CRA) + `@testing-library/react`.
- Current coverage: Minimal — only `App.test.js` with a single placeholder test.
- Test files are co-located with source files (e.g., `App.test.js` alongside `App.js`).
- Run `npm test` for watch mode or `CI=true npm test` for a single pass.

## Deployment

The site deploys to GitHub Pages:

1. `npm run deploy` triggers `predeploy` (builds) then `deploy` (pushes `/build` to `gh-pages` branch).
2. The `homepage` field in `package.json` is set to `https://vishwakamal.github.io/better-earth-today`.

No CI/CD pipelines or GitHub Actions are configured — deployment is manual.

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.js` | Root layout + route definitions |
| `src/App.css` | All application styles |
| `src/components/Header.js` | Navigation bar |
| `src/Pages/HomePage.js` | Landing page |
| `src/Pages/AboutPage.js` | About/team page |
| `src/Pages/CurrentNewsPage.js` | News content page |
| `package.json` | Dependencies, scripts, ESLint config, browserslist |

## Known Issues / Gaps

- No route for `/` — users hitting the root URL see an empty page.
- `App.test.js` searches for "learn react" text that doesn't exist in the app (leftover from CRA scaffold).
- Footer copyright year is hardcoded to 2023.
- No environment variable usage or `.env` files.
- No Prettier or additional linting beyond CRA defaults.
