import React from 'react';

const TECH_STACK = [
  { category: 'Frontend', items: ['React 18', 'React Router v6', 'CSS Custom Properties'] },
  { category: 'APIs', items: ['Open-Meteo Weather', 'Open-Meteo Air Quality', 'USGS Earthquake GeoJSON'] },
  { category: 'Patterns', items: ['Custom Hooks (useFetch)', 'Async/Await', 'Error Boundaries', 'Conditional Rendering'] },
  { category: 'Tooling', items: ['Create React App', 'Jest + React Testing Library', 'GitHub Pages Deployment'] },
];

function AboutPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>About BetterEarthToday</h1>
        <p className="page-subtitle">Environmental monitoring built with modern web technologies</p>
      </div>

      <div className="about-grid">
        <div className="content-box">
          <h2>Our Mission</h2>
          <p>
            BetterEarthToday combines environmental awareness with modern software
            engineering. Rather than displaying static content, this site fetches
            real-time data from multiple public APIs to provide live weather, air
            quality, and seismic activity monitoring.
          </p>
          <p>
            The goal is to make environmental data accessible and to demonstrate
            how software development skills can serve a meaningful cause.
          </p>
        </div>

        <div className="content-box">
          <h2>Technical Highlights</h2>
          <ul className="tech-highlights">
            <li>
              <strong>Custom React Hook</strong> — <code>useFetch</code> abstracts
              all API calls with built-in loading states, error handling, and
              refetch capability using <code>useState</code>, <code>useEffect</code>,
              and <code>useCallback</code>.
            </li>
            <li>
              <strong>3 Live REST APIs</strong> — Weather, air quality, and earthquake
              data fetched in real time with no API keys exposed on the client.
            </li>
            <li>
              <strong>Dynamic Rendering</strong> — UI adapts to data: magnitude-based
              color coding, AQI severity badges, and relative timestamps all
              computed from raw API responses.
            </li>
            <li>
              <strong>State-Driven UI</strong> — Location selection on the dashboard
              triggers new API calls via React state, demonstrating the
              component re-render lifecycle.
            </li>
          </ul>
        </div>
      </div>

      <div className="content-box">
        <h2>Tech Stack</h2>
        <div className="tech-grid">
          {TECH_STACK.map((group) => (
            <div key={group.category} className="tech-group">
              <h3>{group.category}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="content-box">
        <h2>About the Developer</h2>
        <div className="developer-info">
          <h3>Vishwa Kamalbabu</h3>
          <p>
            High school student at Carmel High School with a passion for both
            environmental sustainability and software development. This project
            demonstrates proficiency in React, REST API integration, and
            modern frontend architecture patterns.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
