import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/tracker', label: 'CO₂ Tracker' },
  { to: '/news', label: 'News' },
  { to: '/dashboard', label: 'Dashboard' },
];

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handle, { passive: true });
    handle();
    return () => window.removeEventListener('scroll', handle);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-stone-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <NavLink
          to="/"
          className={`flex items-center gap-2 font-serif text-xl font-semibold transition-colors ${
            transparent ? 'text-white' : 'text-green-800'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-500 shrink-0">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-12.5 5C9 6.5 10.5 4 17 4c0 0-5 1-6 5 3-2 8-2 10-2-6 4-4 10-5 11 .5-2.5 2-7 8-11z"/>
          </svg>
          BetterEarth<span className={transparent ? 'text-white/55' : 'text-stone-400'}>Today</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  transparent
                    ? isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'
                    : isActive ? 'bg-green-50 text-green-800' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${
            transparent ? 'text-white hover:bg-white/10' : 'text-stone-600 hover:bg-stone-100'
          }`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-stone-100 px-4 py-3 space-y-1 shadow-lg">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-green-50 text-green-800' : 'text-stone-700 hover:bg-stone-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
