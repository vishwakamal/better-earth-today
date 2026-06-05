# Better Earth Today

Live environmental awareness web app. **[betterearthtoday.com](https://betterearthtoday.com)**

- **CO₂ Footprint Tracker** — lifestyle-based carbon emissions calculator with real-time SVG gauge and comparison vs world/EU/US averages
- **Environmental News** — live BBC Science & Environment RSS feed with search
- **Climate Dashboard** — interactive world map, click anywhere on Earth for live weather + air quality. Plus global M4.5+ earthquake feed.

## Stack

| | |
|---|---|
| Framework | React 19 + React Router v6 |
| Build | Vite 5 |
| Styling | Tailwind CSS v3, Playfair Display + Inter |
| Map | Leaflet + react-leaflet v5, Esri World Street Map tiles |
| Package manager | npm |
| Deploy | Vercel (auto-deploy from `main`) |
| Domain | betterearthtoday.com (GoDaddy → Vercel DNS) |

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | LandingPage | 3-layer parallax hero, feature cards |
| `/tracker` | TrackerPage | CO₂ calculator — transport, home type/occupants/heating/AC, diet |
| `/news` | NewsPage | BBC RSS feed, search, featured hero card |
| `/dashboard` | DashboardPage | Interactive Leaflet world map + weather/AQI cards + earthquake table |

## Data Sources (all free, no API keys)

| API | Data | Used In |
|-----|------|---------|
| [Open-Meteo](https://open-meteo.com/) | Weather (temp, humidity, wind, feels-like) | Dashboard, Landing |
| [Open-Meteo Air Quality](https://air-quality-api.open-meteo.com/) | AQI, PM2.5, PM10, CO, NO₂ | Dashboard |
| [BBC Science RSS](https://feeds.bbci.co.uk/news/science_and_environment/rss.xml) via [allorigins.win](https://allorigins.win/) | Environmental news | News |
| [USGS Earthquake Feed](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson) | M4.5+ quakes, past 7 days | Dashboard |
| [Nominatim](https://nominatim.openstreetmap.org/) | Reverse geocoding for map clicks | Dashboard |
| [Esri World Street Map](https://server.arcgisonline.com/) | Map tiles (English labels) | Dashboard |

## Project Structure

```
src/
├── App.jsx                  routes
├── main.jsx                 React 19 entry
├── index.css                Tailwind + Leaflet cursor overrides
├── Pages/
│   ├── LandingPage.jsx      parallax hero
│   ├── TrackerPage.jsx      CO₂ calculator
│   ├── NewsPage.jsx         BBC RSS feed
│   └── DashboardPage.jsx    interactive map + climate data
├── components/
│   ├── Header.jsx           sticky nav, transparent→solid on scroll
│   └── Footer.jsx
└── hooks/
    └── useFetch.js          generic fetch hook (loading / error / refetch)

public/
├── favicon.svg              green globe + leaf SVG favicon
└── ...

vercel.json                  SPA rewrite rule (all paths → index.html)
```

## Run Locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # → dist/
npm run preview   # preview production build
```

## Deploy

Vercel auto-deploys on every push to `main`. No env vars required — all APIs are public.

**SPA routing:** `vercel.json` rewrites all paths to `index.html` so direct URL access and refresh work on every route.

## CO₂ Calculator — Energy Estimation

The Home Energy section asks approachable questions instead of raw kWh/therms:
- Home type (apartment / condo / house / mobile)
- Number of occupants
- Heating fuel (electric / gas / oil / none)
- Central A/C (yes / no)

Emissions are estimated from EIA household survey baselines with multipliers per fuel type:
- Electric heat: base electricity × 1.35
- Gas: EIA therms/month by home type + occupants × 0.0053 t/therm
- Oil: gas baseline × 1.38 (38% more CO₂/BTU than gas)
- A/C: electricity baseline × 1.12

## Known Leftover Files (not used)

Legacy CRA files still in `src/` — safe to delete but harmless:
`index.js`, `App.js`, `App.test.js`, `setupTests.js`, `reportWebVitals.js`
