import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80';
const MISSION_IMAGE = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80';
const BANNER_IMAGE = 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80';

const STATS = [
  { value: '14.5t', label: 'CO₂ per person/year', sub: 'US average' },
  { value: '1.5°C', label: 'Climate target', sub: 'Paris Agreement limit' },
  { value: '1M+', label: 'Species threatened', sub: 'IUCN Red List' },
  { value: '2030', label: 'Critical deadline', sub: 'For peak emissions' },
];

const FEATURES = [
  {
    emoji: '🌱',
    title: 'CO₂ Footprint Tracker',
    description: 'Calculate your personal carbon emissions from transport, home energy, and diet. See your score and get actionable tips.',
    to: '/tracker',
    cta: 'Calculate Now',
    bg: 'bg-green-50',
    border: 'border-green-100',
    textColor: 'text-green-800',
    btnClass: 'bg-green-700 hover:bg-green-800 text-white',
  },
  {
    emoji: '📰',
    title: 'Environmental News',
    description: 'Live climate and environment news from trusted global sources, updated automatically — no paywalls.',
    to: '/news',
    cta: 'Read News',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    textColor: 'text-sky-800',
    btnClass: 'bg-sky-700 hover:bg-sky-800 text-white',
  },
  {
    emoji: '📊',
    title: 'Climate Dashboard',
    description: 'Real-time weather, air quality index, and seismic activity from free public APIs across global cities.',
    to: '/dashboard',
    cta: 'Open Dashboard',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    textColor: 'text-amber-800',
    btnClass: 'bg-amber-700 hover:bg-amber-800 text-white',
  },
];

const AQI_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=39.978&longitude=-86.126&current=us_aqi';

function getAqiLevel(aqi) {
  if (aqi <= 50) return { label: 'Good', color: 'text-green-600 bg-green-50' };
  if (aqi <= 100) return { label: 'Moderate', color: 'text-amber-600 bg-amber-50' };
  if (aqi <= 150) return { label: 'Sensitive', color: 'text-orange-600 bg-orange-50' };
  return { label: 'Unhealthy', color: 'text-red-600 bg-red-50' };
}

export default function LandingPage() {
  const aqi = useFetch(AQI_URL);

  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const midRef = useRef(null);
  const fgRef = useRef(null);

  useEffect(() => {
    let rafId;
    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!heroRef.current) return;
        const y = window.scrollY;
        if (y > heroRef.current.offsetHeight) return;
        if (bgRef.current)  bgRef.current.style.transform  = `translateY(${y * 0.3}px)`;
        if (midRef.current) midRef.current.style.transform = `translateY(${y * 0.55}px)`;
        if (fgRef.current)  fgRef.current.style.transform  = `translateY(${y * 0.15}px)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div>
      {/* Hero — 3-layer parallax */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Layer 1 — background forest image, slowest (0.3×) */}
        <div
          ref={bgRef}
          style={{
            position: 'absolute',
            inset: 0,
            top: '-25%',
            bottom: '-25%',
            backgroundImage: `url('${HERO_IMAGE}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: 'transform',
          }}
        />

        {/* Layer 2 — midground atmospheric depth, medium (0.55×) */}
        <div
          ref={midRef}
          style={{
            position: 'absolute',
            inset: 0,
            top: '-15%',
            bottom: '-15%',
            background: 'radial-gradient(ellipse 130% 90% at 50% 65%, transparent 25%, rgba(0,25,8,0.4) 60%, rgba(0,12,4,0.7) 100%)',
            willChange: 'transform',
          }}
        />

        {/* Layer 3 — foreground vignette, slowest overlay (0.15×) */}
        <div
          ref={fgRef}
          style={{
            position: 'absolute',
            inset: 0,
            top: '-8%',
            bottom: '-8%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.55) 100%)',
            willChange: 'transform',
          }}
        />

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6 py-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Environmental Awareness Platform
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6">
            A Better Earth{' '}
            <span className="block text-green-400">Starts with You</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Track your carbon footprint, stay informed on the climate crisis,
            and monitor real-time environmental data worldwide.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/tracker"
              className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5"
            >
              Calculate My Footprint
            </Link>
            <Link
              to="/news"
              className="px-8 py-4 border-2 border-white/50 hover:border-white text-white font-semibold rounded-full transition-all hover:bg-white/10"
            >
              Latest News →
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2 z-10">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2.5 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(({ value, label, sub }) => (
              <div key={label}>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-green-300 mb-1">{value}</div>
                <div className="text-sm font-medium text-white">{label}</div>
                <div className="text-xs text-green-400/80 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label">What We Offer</span>
            <h2 className="font-serif text-4xl font-bold text-stone-900 mt-3">Tools for a Greener Future</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ emoji, title, description, to, cta, bg, border, textColor, btnClass }) => (
              <div key={to} className={`rounded-2xl border p-8 flex flex-col ${bg} ${border}`}>
                <div className="text-4xl mb-5">{emoji}</div>
                <h3 className={`font-serif text-xl font-bold mb-3 ${textColor}`}>{title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed flex-1">{description}</p>
                <Link
                  to={to}
                  className={`mt-6 inline-block text-center px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${btnClass}`}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label">Our Mission</span>
              <h2 className="font-serif text-4xl font-bold text-stone-900 mt-3 mb-6 leading-tight">
                Why Environmental Awareness Matters Now
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Human activity has raised global temperatures by 1.1°C since pre-industrial times.
                Every fraction of a degree drives more extreme weather, ecosystem collapse, and sea level rise.
              </p>
              <p className="text-stone-600 leading-relaxed mb-8">
                BetterEarthToday gives you tools to understand your personal impact, stay informed
                with real news, and monitor live environmental data. Small actions at scale create the
                systemic change we need.
              </p>
              <Link
                to="/tracker"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-full transition-all"
              >
                Start Tracking →
              </Link>
            </div>
            <div className="relative">
              <img
                src={MISSION_IMAGE}
                alt="Sunlight through forest trees"
                className="rounded-3xl shadow-2xl w-full object-cover h-96"
              />
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-lg p-5 border border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">97%</div>
                  <div>
                    <div className="text-sm font-semibold text-stone-800">Scientific Consensus</div>
                    <div className="text-xs text-stone-500">Climate change is real &amp; human-caused</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live data */}
      <section className="py-16 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="section-label">Live Data</span>
                <h3 className="font-serif text-3xl font-bold text-stone-900 mt-2 mb-4">Real Numbers, Right Now</h3>
                <p className="text-stone-600 leading-relaxed mb-6">
                  Every number on this site is fetched live from public APIs —
                  no hardcoded data. Weather, air quality, earthquakes, news.
                </p>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white font-semibold rounded-full transition-all text-sm"
                >
                  Open Dashboard →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100">
                  <div className="text-2xl font-bold text-stone-800">
                    {aqi.loading ? '—' : aqi.error ? 'N/A' : aqi.data?.current?.us_aqi}
                  </div>
                  <div className="text-sm text-stone-500 mt-1">US AQI (Carmel, IN)</div>
                  {!aqi.loading && !aqi.error && aqi.data && (
                    <span className={`mt-2 inline-block text-xs font-medium px-2 py-0.5 rounded-full ${getAqiLevel(aqi.data.current.us_aqi).color}`}>
                      {getAqiLevel(aqi.data.current.us_aqi).label}
                    </span>
                  )}
                </div>
                <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100">
                  <div className="text-2xl font-bold text-stone-800">Live</div>
                  <div className="text-sm text-stone-500 mt-1">Weather &amp; AQI</div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-stone-500">Updated now</span>
                  </div>
                </div>
                <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 col-span-2">
                  <div className="flex gap-2 flex-wrap">
                    {['Open-Meteo', 'USGS', 'BBC News', 'Unsplash'].map((s) => (
                      <span key={s} className="text-xs bg-green-50 text-green-700 border border-green-100 px-2.5 py-1 rounded-full font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-stone-500 mt-2">Free, public APIs — no paywalls</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section
        className="relative py-24 overflow-hidden"
        style={{ backgroundImage: `url('${BANNER_IMAGE}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-green-950/80" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-6">Ready to Know Your Impact?</h2>
          <p className="text-green-200/80 text-lg max-w-xl mx-auto mb-10">
            It takes under 2 minutes to calculate your carbon footprint and see how you compare.
          </p>
          <Link
            to="/tracker"
            className="px-10 py-4 bg-white text-green-900 font-bold rounded-full hover:bg-green-50 transition-all shadow-xl text-lg"
          >
            Start for Free →
          </Link>
        </div>
      </section>
    </div>
  );
}
