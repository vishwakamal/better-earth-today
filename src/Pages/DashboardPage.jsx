import { useState, useCallback } from 'react';
import useFetch from '../hooks/useFetch.js';

const WEATHER_CODES = {
  0:'Clear Sky', 1:'Mainly Clear', 2:'Partly Cloudy', 3:'Overcast',
  45:'Foggy', 48:'Rime Fog', 51:'Light Drizzle', 53:'Drizzle', 55:'Heavy Drizzle',
  61:'Light Rain', 63:'Rain', 65:'Heavy Rain',
  71:'Light Snow', 73:'Snow', 75:'Heavy Snow', 77:'Snow Grains',
  80:'Light Showers', 81:'Showers', 82:'Heavy Showers',
  85:'Snow Showers', 86:'Heavy Snow Showers',
  95:'Thunderstorm', 96:'Thunderstorm w/ Hail', 99:'Severe Thunderstorm',
};

const LOCATIONS = [
  { name: 'Carmel, IN', lat: 39.978, lon: -86.126 },
  { name: 'New York, NY', lat: 40.713, lon: -74.006 },
  { name: 'Los Angeles, CA', lat: 34.052, lon: -118.244 },
  { name: 'London, UK', lat: 51.507, lon: -0.128 },
  { name: 'Tokyo, Japan', lat: 35.690, lon: 139.692 },
];

function getAqiLevel(aqi) {
  if (aqi == null) return { label: 'N/A', color: 'text-stone-500 bg-stone-50' };
  if (aqi <= 50) return { label: 'Good', color: 'text-green-700 bg-green-50' };
  if (aqi <= 100) return { label: 'Moderate', color: 'text-amber-700 bg-amber-50' };
  if (aqi <= 150) return { label: 'Unhealthy (Sensitive)', color: 'text-orange-700 bg-orange-50' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-700 bg-red-50' };
  return { label: 'Hazardous', color: 'text-purple-700 bg-purple-50' };
}

function Spinner() {
  return <div className="flex justify-center py-8"><div className="spinner" /></div>;
}

function StatBlock({ label, value }) {
  return (
    <div>
      <div className="text-xs text-stone-500 mb-1">{label}</div>
      <div className="text-lg font-bold text-stone-800">{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [loc, setLoc] = useState(LOCATIONS[0]);

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph`;
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${loc.lat}&longitude=${loc.lon}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide`;
  const quakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';

  const weather = useFetch(weatherUrl);
  const aqi = useFetch(aqiUrl);
  const quakes = useFetch(quakeUrl);

  const handleLoc = useCallback((e) => {
    const found = LOCATIONS.find((l) => l.name === e.target.value);
    if (found) setLoc(found);
  }, []);

  const cur = weather.data?.current;
  const aqiData = aqi.data?.current;
  const quakeList = quakes.data?.features?.slice(0, 8) || [];

  return (
    <div className="page-wrapper bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <span className="section-label">Live Data</span>
          <h1 className="font-serif text-4xl font-bold text-stone-900 mt-2">Climate Dashboard</h1>
          <p className="text-stone-500 mt-1 text-sm">Real-time weather, air quality, and seismic data — no API key required</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <label htmlFor="loc" className="text-sm font-medium text-stone-700">Location:</label>
          <select
            id="loc"
            value={loc.name}
            onChange={handleLoc}
            className="px-4 py-2 border border-stone-200 rounded-xl bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {LOCATIONS.map((l) => <option key={l.name} value={l.name}>{l.name}</option>)}
          </select>
          <button
            onClick={() => { weather.refetch(); aqi.refetch(); }}
            className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Refresh
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h2 className="font-serif text-lg font-bold text-stone-800 mb-4">Weather — {loc.name}</h2>
            {weather.loading && <Spinner />}
            {weather.error && <p className="text-red-500 text-sm py-4">Failed: {weather.error}</p>}
            {cur && (
              <div>
                <div className="flex items-end gap-4 mb-6">
                  <span className="font-serif text-6xl font-bold text-stone-900">{Math.round(cur.temperature_2m)}°F</span>
                  <span className="text-stone-500 text-base pb-2">{WEATHER_CODES[cur.weather_code] || `Code ${cur.weather_code}`}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <StatBlock label="Feels Like" value={`${Math.round(cur.apparent_temperature)}°F`} />
                  <StatBlock label="Humidity" value={`${cur.relative_humidity_2m}%`} />
                  <StatBlock label="Wind" value={`${cur.wind_speed_10m} mph`} />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h2 className="font-serif text-lg font-bold text-stone-800 mb-4">Air Quality — {loc.name}</h2>
            {aqi.loading && <Spinner />}
            {aqi.error && <p className="text-red-500 text-sm py-4">Failed: {aqi.error}</p>}
            {aqiData && (
              <div>
                <div className="flex items-end gap-4 mb-6">
                  <span className="font-serif text-6xl font-bold text-stone-900">{aqiData.us_aqi ?? '—'}</span>
                  <span className={`mb-2 text-sm font-semibold px-3 py-1 rounded-full ${getAqiLevel(aqiData.us_aqi).color}`}>
                    {getAqiLevel(aqiData.us_aqi).label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <StatBlock label="PM2.5" value={aqiData.pm2_5 != null ? `${aqiData.pm2_5.toFixed(1)} µg/m³` : '—'} />
                  <StatBlock label="PM10" value={aqiData.pm10 != null ? `${aqiData.pm10.toFixed(1)} µg/m³` : '—'} />
                  <StatBlock label="CO" value={aqiData.carbon_monoxide != null ? `${aqiData.carbon_monoxide.toFixed(1)} µg/m³` : '—'} />
                  <StatBlock label="NO₂" value={aqiData.nitrogen_dioxide != null ? `${aqiData.nitrogen_dioxide.toFixed(1)} µg/m³` : '—'} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-800">Recent M4.5+ Earthquakes</h2>
              <p className="text-xs text-stone-400 mt-0.5">Last 7 days · USGS Earthquake Hazards Program</p>
            </div>
            {quakes.loading && <div className="w-5 h-5 border-2 border-stone-200 border-t-green-600 rounded-full animate-spin" />}
          </div>
          {quakes.error && <p className="text-red-500 text-sm py-4">Failed: {quakes.error}</p>}
          {!quakes.loading && !quakes.error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-stone-400 uppercase tracking-wide border-b border-stone-100">
                    <th className="pb-3 font-medium pr-4">Magnitude</th>
                    <th className="pb-3 font-medium pr-4">Location</th>
                    <th className="pb-3 font-medium pr-4">Date</th>
                    <th className="pb-3 font-medium">Depth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {quakeList.map((q) => {
                    const mag = q.properties.mag;
                    const mc = mag >= 7 ? 'text-red-700 bg-red-50' : mag >= 6 ? 'text-orange-700 bg-orange-50' : mag >= 5 ? 'text-amber-700 bg-amber-50' : 'text-stone-600 bg-stone-50';
                    return (
                      <tr key={q.id} className="hover:bg-stone-50 transition-colors">
                        <td className="py-3 pr-4">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${mc}`}>M {mag?.toFixed(1)}</span>
                        </td>
                        <td className="py-3 pr-4 text-stone-700 max-w-xs truncate">{q.properties.place}</td>
                        <td className="py-3 pr-4 text-stone-500">
                          {new Date(q.properties.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-3 text-stone-500">{q.geometry?.coordinates?.[2]?.toFixed(0)} km</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {quakeList.length === 0 && <p className="text-center text-stone-400 py-8 text-sm">No M4.5+ earthquakes this week</p>}
            </div>
          )}
        </div>

        <div className="mt-6 bg-stone-100 rounded-2xl p-5 text-sm text-stone-600">
          <strong className="text-stone-800">Data sources:</strong>{' '}
          Weather and air quality from{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">Open-Meteo</a>
          {' '}(free, no API key). Earthquake data from{' '}
          <a href="https://earthquake.usgs.gov/" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">USGS</a>.
          All data fetched live on page load via a custom <code className="bg-stone-200 px-1 py-0.5 rounded text-xs">useFetch</code> hook.
        </div>
      </div>
    </div>
  );
}
