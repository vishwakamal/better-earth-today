# Better Earth Today

Better Earth Today is a React + Vite web app focused on environmental awareness.  
It combines three user-facing tools:

- **CO₂ Footprint Tracker** – estimates yearly personal emissions from transport, home energy, and diet inputs.
- **Environmental News** – fetches live BBC Science & Environment RSS stories with search and refresh support.
- **Climate Dashboard** – shows live weather, air quality, and recent earthquake data from public APIs.

## Tech Stack

- React 19
- React Router
- Vite 5
- Tailwind CSS

## Key Features

- Modern landing page with parallax hero and CTA flow
- Lifestyle-based carbon footprint calculation with category breakdown and suggestions
- Live climate news feed parsing RSS XML in-browser
- Real-time dashboard for:
  - Weather
  - Air quality (AQI, PM2.5, PM10, gases)
  - M4.5+ earthquake activity
- Shared `useFetch` hook for API loading/error/refetch behavior

## Project Structure

```text
src/
  components/
    Header.jsx
    Footer.jsx
  hooks/
    useFetch.js
  Pages/
    LandingPage.jsx
    TrackerPage.jsx
    NewsPage.jsx
    DashboardPage.jsx
  App.jsx
  main.jsx
  index.css
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm ci
```

### Run locally

```bash
npm run dev
```

Then open the local URL shown by Vite (typically `http://localhost:5173`).

## Available Scripts

- `npm run dev` – start the Vite development server
- `npm run build` – create a production build in `dist/`
- `npm run preview` – preview the production build locally

## Data Sources

- [Open-Meteo](https://open-meteo.com/) (weather + air quality)
- [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/) (earthquake feed)
- [BBC Science & Environment RSS](https://feeds.bbci.co.uk/news/science_and_environment/rss.xml) (news)
- [allorigins.win](https://allorigins.win/) (RSS proxy for browser CORS access)

## Notes

- The active app entrypoint is `src/main.jsx` with routes in `src/App.jsx`.
- Some legacy CRA-era files (`src/index.js`, `src/App.js`, etc.) are present in the repository but not used by the Vite entrypoint.
