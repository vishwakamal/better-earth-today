import React, { useState } from 'react';
import useFetch from '../hooks/useFetch';

const FEED_OPTIONS = [
  { label: 'M4.5+ Past Week', url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson' },
  { label: 'M2.5+ Past Day', url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson' },
  { label: 'Significant Past Month', url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson' },
];

function getMagnitudeClass(mag) {
  if (mag >= 7) return 'mag-severe';
  if (mag >= 6) return 'mag-high';
  if (mag >= 5) return 'mag-moderate';
  return 'mag-low';
}

function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function EventsPage() {
  const [feedIndex, setFeedIndex] = useState(0);
  const { data, loading, error, refetch } = useFetch(FEED_OPTIONS[feedIndex].url);

  const events = data?.features || [];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Seismic Events</h1>
        <p className="page-subtitle">
          Live earthquake data from the USGS GeoJSON API — updated every minute
        </p>
      </div>

      <div className="controls">
        <label htmlFor="feed-select" className="control-label">Feed:</label>
        <select
          id="feed-select"
          className="select-input"
          value={feedIndex}
          onChange={(e) => setFeedIndex(Number(e.target.value))}
        >
          {FEED_OPTIONS.map((opt, i) => (
            <option key={opt.url} value={i}>{opt.label}</option>
          ))}
        </select>
        <button className="btn btn-small" onClick={refetch}>Refresh</button>
      </div>

      {loading && <div className="loading-spinner" />}
      {error && <p className="error-text">Failed to load earthquake data: {error}</p>}

      {!loading && !error && (
        <>
          <p className="result-count">{events.length} events found</p>
          <div className="events-list">
            {events.map((event) => {
              const { mag, place, time, url, tsunami } = event.properties;
              const [lon, lat, depth] = event.geometry.coordinates;
              return (
                <div key={event.id} className="event-card">
                  <div className={`event-mag ${getMagnitudeClass(mag)}`}>
                    {mag.toFixed(1)}
                  </div>
                  <div className="event-info">
                    <h3 className="event-place">{place}</h3>
                    <div className="event-details">
                      <span>Depth: {depth.toFixed(1)} km</span>
                      <span>Coords: {lat.toFixed(2)}, {lon.toFixed(2)}</span>
                      <span>{formatTimeAgo(time)}</span>
                      {tsunami === 1 && <span className="tsunami-warning">Tsunami Alert</span>}
                    </div>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="event-link"
                    >
                      View on USGS
                    </a>
                  </div>
                </div>
              );
            })}
            {events.length === 0 && (
              <p className="no-data">No earthquake events found for this feed.</p>
            )}
          </div>
        </>
      )}

      <div className="content-box" style={{ marginTop: '2rem' }}>
        <h3>About This Data</h3>
        <p>
          Earthquake data is sourced live from the{' '}
          <a href="https://earthquake.usgs.gov/earthquakes/feed/" target="_blank" rel="noopener noreferrer">
            USGS Earthquake Hazards Program GeoJSON Feed
          </a>.
          The API provides real-time seismic event data in GeoJSON format,
          parsed client-side and rendered with dynamic magnitude-based styling.
        </p>
      </div>
    </div>
  );
}

export default EventsPage;
