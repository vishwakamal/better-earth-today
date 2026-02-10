import React, { useState, useCallback } from 'react';
import useFetch from '../hooks/useFetch';

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
  if (aqi == null) return { label: 'N/A', className: '' };
  if (aqi <= 50) return { label: 'Good', className: 'aqi-good' };
  if (aqi <= 100) return { label: 'Moderate', className: 'aqi-moderate' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', className: 'aqi-sensitive' };
  if (aqi <= 200) return { label: 'Unhealthy', className: 'aqi-unhealthy' };
  if (aqi <= 300) return { label: 'Very Unhealthy', className: 'aqi-hazardous' };
  return { label: 'Hazardous', className: 'aqi-hazardous' };
}

const PRESET_LOCATIONS = [
  { name: 'Carmel, IN', lat: 39.978, lon: -86.126 },
  { name: 'New York, NY', lat: 40.713, lon: -74.006 },
  { name: 'Los Angeles, CA', lat: 34.052, lon: -118.244 },
  { name: 'London, UK', lat: 51.507, lon: -0.128 },
  { name: 'Tokyo, Japan', lat: 35.690, lon: 139.692 },
];

function DashboardPage() {
  const [location, setLocation] = useState(PRESET_LOCATIONS[0]);

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph`;
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.lat}&longitude=${location.lon}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide`;

  const weather = useFetch(weatherUrl);
  const aqi = useFetch(aqiUrl);

  const handleLocationChange = useCallback((e) => {
    const loc = PRESET_LOCATIONS.find(l => l.name === e.target.value);
    if (loc) setLocation(loc);
  }, []);

  const current = weather.data?.current;
  const aqiData = aqi.data?.current;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Climate Dashboard</h1>
        <p className="page-subtitle">Real-time weather and air quality data from Open-Meteo REST APIs</p>
      </div>

      <div className="controls">
        <label htmlFor="location-select" className="control-label">Location:</label>
        <select
          id="location-select"
          className="select-input"
          value={location.name}
          onChange={handleLocationChange}
        >
          {PRESET_LOCATIONS.map(loc => (
            <option key={loc.name} value={loc.name}>{loc.name}</option>
          ))}
        </select>
        <button className="btn btn-small" onClick={() => { weather.refetch(); aqi.refetch(); }}>
          Refresh Data
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card dashboard-card-wide">
          <h2>Weather</h2>
          {weather.loading && <div className="loading-spinner" />}
          {weather.error && <p className="error-text">Error: {weather.error}</p>}
          {current && (
            <div className="weather-details">
              <div className="weather-main">
                <span className="weather-temp">{Math.round(current.temperature_2m)}°F</span>
                <span className="weather-condition">
                  {WEATHER_CODES[current.weather_code] || `Code ${current.weather_code}`}
                </span>
              </div>
              <div className="weather-stats">
                <div className="weather-stat">
                  <span className="weather-stat-label">Feels Like</span>
                  <span className="weather-stat-value">{Math.round(current.apparent_temperature)}°F</span>
                </div>
                <div className="weather-stat">
                  <span className="weather-stat-label">Humidity</span>
                  <span className="weather-stat-value">{current.relative_humidity_2m}%</span>
                </div>
                <div className="weather-stat">
                  <span className="weather-stat-label">Wind Speed</span>
                  <span className="weather-stat-value">{current.wind_speed_10m} mph</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-card dashboard-card-wide">
          <h2>Air Quality</h2>
          {aqi.loading && <div className="loading-spinner" />}
          {aqi.error && <p className="error-text">Error: {aqi.error}</p>}
          {aqiData && (
            <div className="aqi-details">
              <div className="aqi-main">
                <span className="aqi-value">{aqiData.us_aqi ?? 'N/A'}</span>
                <span className={`stat-badge ${getAqiLevel(aqiData.us_aqi).className}`}>
                  {getAqiLevel(aqiData.us_aqi).label}
                </span>
              </div>
              <div className="aqi-stats">
                <div className="aqi-stat">
                  <span className="aqi-stat-label">PM2.5</span>
                  <span className="aqi-stat-value">{aqiData.pm2_5?.toFixed(1) ?? 'N/A'} µg/m³</span>
                </div>
                <div className="aqi-stat">
                  <span className="aqi-stat-label">PM10</span>
                  <span className="aqi-stat-value">{aqiData.pm10?.toFixed(1) ?? 'N/A'} µg/m³</span>
                </div>
                <div className="aqi-stat">
                  <span className="aqi-stat-label">CO</span>
                  <span className="aqi-stat-value">{aqiData.carbon_monoxide?.toFixed(1) ?? 'N/A'} µg/m³</span>
                </div>
                <div className="aqi-stat">
                  <span className="aqi-stat-label">NO₂</span>
                  <span className="aqi-stat-value">{aqiData.nitrogen_dioxide?.toFixed(1) ?? 'N/A'} µg/m³</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="content-box">
        <h3>About This Data</h3>
        <p>
          Weather and air quality data is fetched live from the{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo API</a>.
          The US AQI (Air Quality Index) measures pollutant concentration on a 0–500 scale.
          Select different cities to compare environmental conditions worldwide.
        </p>
        <p>
          <strong>Technical note:</strong> Each location change triggers new <code>fetch()</code> requests
          via the custom <code>useFetch</code> hook, which manages loading/error states through
          React's <code>useState</code> and <code>useEffect</code> hooks.
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;
