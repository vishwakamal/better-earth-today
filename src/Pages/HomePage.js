import React from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';

const CARMEL_IN = { lat: 39.978, lon: -86.126 };

const WEATHER_URL = `https://api.open-meteo.com/v1/forecast?latitude=${CARMEL_IN.lat}&longitude=${CARMEL_IN.lon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`;
const AQI_URL = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${CARMEL_IN.lat}&longitude=${CARMEL_IN.lon}&current=us_aqi`;
const QUAKE_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';

const WEATHER_CODES = {
  0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Rime Fog', 51: 'Light Drizzle', 53: 'Drizzle',
  55: 'Heavy Drizzle', 61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
  71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 77: 'Snow Grains',
  80: 'Light Showers', 81: 'Showers', 82: 'Heavy Showers',
  85: 'Snow Showers', 86: 'Heavy Snow Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm w/ Hail', 99: 'Severe Thunderstorm',
};

function getAqiLevel(aqi) {
  if (aqi <= 50) return { label: 'Good', className: 'aqi-good' };
  if (aqi <= 100) return { label: 'Moderate', className: 'aqi-moderate' };
  if (aqi <= 150) return { label: 'Unhealthy (Sensitive)', className: 'aqi-sensitive' };
  if (aqi <= 200) return { label: 'Unhealthy', className: 'aqi-unhealthy' };
  return { label: 'Hazardous', className: 'aqi-hazardous' };
}

function StatCard({ title, children, loading, error }) {
  return (
    <div className="stat-card">
      <h3 className="stat-card-title">{title}</h3>
      {loading && <div className="loading-spinner" />}
      {error && <p className="error-text">Failed to load: {error}</p>}
      {!loading && !error && children}
    </div>
  );
}

function HomePage() {
  const weather = useFetch(WEATHER_URL);
  const aqi = useFetch(AQI_URL);
  const quakes = useFetch(QUAKE_URL);

  const latestQuake = quakes.data?.features?.[0];

  return (
    <div className="page">
      <section className="hero">
        <h1>BetterEarthToday</h1>
        <p className="hero-subtitle">
          Real-time environmental monitoring powered by live API data.
          Track weather, air quality, and seismic activity worldwide.
        </p>
        <div className="hero-actions">
          <Link to="/dashboard" className="btn btn-primary">Climate Dashboard</Link>
          <Link to="/events" className="btn btn-outline">Seismic Events</Link>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard title="Current Weather — Carmel, IN" loading={weather.loading} error={weather.error}>
          {weather.data && (
            <>
              <p className="stat-value">{Math.round(weather.data.current.temperature_2m)}°F</p>
              <p className="stat-label">
                {WEATHER_CODES[weather.data.current.weather_code] || 'Unknown'}
              </p>
            </>
          )}
        </StatCard>

        <StatCard title="Air Quality Index" loading={aqi.loading} error={aqi.error}>
          {aqi.data && (
            <>
              <p className="stat-value">{aqi.data.current.us_aqi}</p>
              <p className={`stat-badge ${getAqiLevel(aqi.data.current.us_aqi).className}`}>
                {getAqiLevel(aqi.data.current.us_aqi).label}
              </p>
            </>
          )}
        </StatCard>

        <StatCard title="Latest M4.5+ Earthquake" loading={quakes.loading} error={quakes.error}>
          {latestQuake && (
            <>
              <p className="stat-value">M {latestQuake.properties.mag.toFixed(1)}</p>
              <p className="stat-label">{latestQuake.properties.place}</p>
              <p className="stat-meta">
                {new Date(latestQuake.properties.time).toLocaleDateString()}
              </p>
            </>
          )}
        </StatCard>
      </section>

      <section className="content-box api-info">
        <h2>Live Data, No Mocks</h2>
        <p>
          Every number on this site is fetched in real time from public REST APIs — no
          hardcoded data. Built with a custom <code>useFetch</code> React hook that
          handles loading states, error recovery, and refetching.
        </p>
        <div className="api-badges">
          <span className="api-badge">Open-Meteo Weather API</span>
          <span className="api-badge">Open-Meteo Air Quality API</span>
          <span className="api-badge">USGS Earthquake API</span>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
