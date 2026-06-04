import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-green-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 font-serif text-xl font-semibold mb-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-400">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-12.5 5C9 6.5 10.5 4 17 4c0 0-5 1-6 5 3-2 8-2 10-2-6 4-4 10-5 11 .5-2.5 2-7 8-11z"/>
              </svg>
              BetterEarthToday
            </div>
            <p className="text-green-300/70 text-sm leading-relaxed">
              Environmental awareness tools powered by real-time public data.
              Know your impact. Take action.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-green-400 mb-4">Tools</h4>
            <ul className="space-y-2">
              {[
                { to: '/tracker', label: 'CO₂ Footprint Tracker' },
                { to: '/news', label: 'Environmental News' },
                { to: '/dashboard', label: 'Climate Dashboard' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-green-200/60 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-green-400 mb-4">Data Sources</h4>
            <ul className="space-y-2">
              {[
                { href: 'https://open-meteo.com/', label: 'Open-Meteo' },
                { href: 'https://earthquake.usgs.gov/', label: 'USGS Earthquakes' },
                { href: 'https://rss2json.com/', label: 'RSS2JSON' },
                { href: 'https://unsplash.com/', label: 'Unsplash Photos' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-green-200/60 hover:text-white text-sm transition-colors">
                    {label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-green-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-green-400/50">
          <p>© {new Date().getFullYear()} BetterEarthToday — Free &amp; Open Source</p>
          <p>React 19 + Vite + Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
