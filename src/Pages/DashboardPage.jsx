import { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

const QUICK_LOCATIONS = [
  { name: 'Carmel, IN',   lat: 39.978,  lon: -86.126 },
  { name: 'New York',     lat: 40.713,  lon: -74.006 },
  { name: 'Los Angeles',  lat: 34.052,  lon: -118.244 },
  { name: 'London',       lat: 51.507,  lon: -0.128 },
  { name: 'Tokyo',        lat: 35.690,  lon: 139.692 },
  { name: 'Sydney',       lat: -33.869, lon: 151.209 },
  { name: 'São Paulo',    lat: -23.550, lon: -46.633 },
  { name: 'Mumbai',       lat: 19.076,  lon: 72.878 },
  { name: 'Cairo',        lat: 30.033,  lon: 31.233 },
  { name: 'Nairobi',      lat: -1.286,  lon: 36.820 },
  { name: 'Moscow',       lat: 55.755,  lon: 37.617 },
  { name: 'Beijing',      lat: 39.905,  lon: 116.391 },
];

// Custom green pin using divIcon — avoids Leaflet/Vite static asset import issues
const PIN_ICON = L.divIcon({
  className: '',
  html: `<div style="position:relative;width:28px;height:40px">
    <div style="
      width:26px;height:26px;
      background:#15803d;
      border-radius:50%;
      border:3px solid white;
      box-shadow:0 3px 10px rgba(0,0,0,0.4);
      position:absolute;top:0;left:1px;
      display:flex;align-items:center;justify-content:center
    ">
      <div style="width:8px;height:8px;background:white;border-radius:50%"></div>
    </div>
    <div style="
      width:0;height:0;
      border-left:7px solid transparent;
      border-right:7px solid transparent;
      border-top:12px solid #15803d;
      position:absolute;bottom:0;left:7px
    "></div>
  </div>`,
  iconSize: [28, 40],
  iconAnchor: [14, 40],
});

function getAqiLevel(aqi) {
  if (aqi == null) return { label: 'N/A', color: 'text-stone-500 bg-stone-50' };
  if (aqi <= 50)  return { label: 'Good', color: 'text-green-700 bg-green-50' };
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

// Lives inside MapContainer — listens for clicks and flies on quick-select
function MapController({ onMapClick, flyTarget }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (flyTarget) {
      map.flyTo([flyTarget.lat, flyTarget.lon], Math.max(map.getZoom(), 5), { duration: 1.0 });
    }
  }, [flyTarget, map]);

  return null;
}

async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat.toFixed(5)}&lon=${lon.toFixed(5)}&zoom=10&addressdetails=1`,
      { headers: { 'User-Agent': 'BetterEarthToday/1.0' } }
    );
    if (!res.ok) return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
    const data = await res.json();
    const addr = data.address || {};
    const place = addr.city || addr.town || addr.village || addr.county || addr.state || 'Open Ocean';
    const country = addr.country || '';
    return country ? `${place}, ${country}` : place;
  } catch {
    return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
  }
}

export default function DashboardPage() {
  const [pin, setPin] = useState({ lat: 39.978, lon: -86.126, name: 'Carmel, IN' });
  const [nameLoading, setNameLoading] = useState(false);
  const [flyTarget, setFlyTarget] = useState(null);

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${pin.lat}&longitude=${pin.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph`;
  const aqiUrl    = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${pin.lat}&longitude=${pin.lon}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide`;
  const quakeUrl  = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';

  const weather = useFetch(weatherUrl);
  const aqi     = useFetch(aqiUrl);
  const quakes  = useFetch(quakeUrl);

  const handleMapClick = useCallback(async (lat, lon) => {
    setNameLoading(true);
    setPin({ lat, lon, name: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°` });
    const name = await reverseGeocode(lat, lon);
    setPin({ lat, lon, name });
    setNameLoading(false);
  }, []);

  const handleQuickSelect = useCallback((loc) => {
    setPin({ lat: loc.lat, lon: loc.lon, name: loc.name });
    setFlyTarget({ lat: loc.lat, lon: loc.lon });
  }, []);

  const cur       = weather.data?.current;
  const aqiData   = aqi.data?.current;
  const quakeList = quakes.data?.features?.slice(0, 8) || [];

  return (
    <div className="page-wrapper bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="mb-6">
          <span className="section-label">Live Data</span>
          <h1 className="font-serif text-4xl font-bold text-stone-900 mt-2">Climate Dashboard</h1>
          <p className="text-stone-500 mt-1 text-sm">
            Click anywhere on the globe — drag to explore, scroll to zoom, click to pull live climate data for any spot on Earth.
          </p>
        </div>

        {/* Quick location chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {QUICK_LOCATIONS.map((loc) => (
            <button
              key={loc.name}
              onClick={() => handleQuickSelect(loc)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                pin.name === loc.name
                  ? 'bg-green-700 text-white border-green-700 shadow-sm'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-green-500 hover:text-green-700'
              }`}
            >
              {loc.name}
            </button>
          ))}
          <button
            onClick={() => { weather.refetch(); aqi.refetch(); }}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border bg-white text-stone-600 border-stone-200 hover:border-green-500 hover:text-green-700 transition-all"
          >
            ↺ Refresh
          </button>
        </div>

        {/* Interactive Map */}
        <div
          className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-md mb-6"
          style={{ height: '58vh', minHeight: '400px' }}
        >
          <MapContainer
            center={[pin.lat, pin.lon]}
            zoom={4}
            style={{ height: '100%', width: '100%', cursor: 'crosshair' }}
            worldCopyJump
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a>'
              maxZoom={19}
            />
            <MapController onMapClick={handleMapClick} flyTarget={flyTarget} />
            <Marker position={[pin.lat, pin.lon]} icon={PIN_ICON} />
          </MapContainer>

          {/* Floating location badge */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-md border border-stone-100 max-w-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-700 text-base">📍</span>
              <span className="text-sm font-semibold text-stone-800 truncate">
                {nameLoading ? 'Locating…' : pin.name}
              </span>
            </div>
            <div className="text-xs text-stone-400 mt-0.5 font-mono">
              {pin.lat.toFixed(4)}°, {pin.lon.toFixed(4)}°
            </div>
          </div>

          {/* Click hint */}
          <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm border border-stone-100 text-xs text-stone-500 pointer-events-none">
            Click anywhere to explore
          </div>
        </div>

        {/* Weather + AQI */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h2 className="font-serif text-lg font-bold text-stone-800 mb-1">Weather</h2>
            <p className="text-xs text-stone-400 mb-4">{nameLoading ? '…' : pin.name}</p>
            {weather.loading && <Spinner />}
            {weather.error && <p className="text-red-500 text-sm py-4">Failed: {weather.error}</p>}
            {cur && (
              <div>
                <div className="flex items-end gap-4 mb-6">
                  <span className="font-serif text-6xl font-bold text-stone-900">{Math.round(cur.temperature_2m)}°F</span>
                  <span className="text-stone-500 text-base pb-2">{WEATHER_CODES[cur.weather_code] ?? `Code ${cur.weather_code}`}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <StatBlock label="Feels Like" value={`${Math.round(cur.apparent_temperature)}°F`} />
                  <StatBlock label="Humidity"   value={`${cur.relative_humidity_2m}%`} />
                  <StatBlock label="Wind"        value={`${cur.wind_speed_10m} mph`} />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h2 className="font-serif text-lg font-bold text-stone-800 mb-1">Air Quality</h2>
            <p className="text-xs text-stone-400 mb-4">{nameLoading ? '…' : pin.name}</p>
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
                  <StatBlock label="PM2.5" value={aqiData.pm2_5 != null            ? `${aqiData.pm2_5.toFixed(1)} µg/m³`            : '—'} />
                  <StatBlock label="PM10"  value={aqiData.pm10 != null             ? `${aqiData.pm10.toFixed(1)} µg/m³`             : '—'} />
                  <StatBlock label="CO"    value={aqiData.carbon_monoxide != null  ? `${aqiData.carbon_monoxide.toFixed(1)} µg/m³`  : '—'} />
                  <StatBlock label="NO₂"   value={aqiData.nitrogen_dioxide != null ? `${aqiData.nitrogen_dioxide.toFixed(1)} µg/m³` : '—'} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Earthquakes (global feed, not location-specific) */}
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
          Map tiles from{' '}
          <a href="https://carto.com/" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">CARTO</a>{' '}
          via OpenStreetMap. Location names from{' '}
          <a href="https://nominatim.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">Nominatim</a>.
        </div>

      </div>
    </div>
  );
}
