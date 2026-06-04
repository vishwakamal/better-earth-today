import { useState, useMemo } from 'react';
import useFetch from '../hooks/useFetch.js';

// allorigins.win: free CORS proxy, no key required, returns { contents: "<xml>..." }
const BBC_RSS = 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml';
const NEWS_URL = `https://api.allorigins.win/get?url=${encodeURIComponent(BBC_RSS)}`;

const NS_MEDIA = 'http://search.yahoo.com/mrss/';

function parseRSS(data) {
  if (!data?.contents) return [];
  try {
    const doc = new DOMParser().parseFromString(data.contents, 'text/xml');
    return [...doc.querySelectorAll('item')].slice(0, 18).map((el) => {
      const text = (sel) => el.querySelector(sel)?.textContent?.trim() || '';
      const thumb =
        el.getElementsByTagNameNS(NS_MEDIA, 'thumbnail')[0]?.getAttribute('url') ||
        el.querySelector('enclosure[type^="image"]')?.getAttribute('url') ||
        '';
      return {
        title: text('title'),
        link: text('link') || text('guid'),
        description: text('description'),
        pubDate: text('pubDate'),
        thumbnail: thumb,
        content: text('encoded') || '',
      };
    });
  } catch {
    return [];
  }
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=60',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=60',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=60',
  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=60',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=60',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=60',
];

const stripHtml = (html) => html ? html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/g, ' ').trim() : '';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return ''; }
};

const getImage = (item, index) => {
  if (item.thumbnail?.startsWith('http')) return item.thumbnail;
  const match = item.content?.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
};

function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-48 bg-stone-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-stone-200 rounded w-1/3" />
        <div className="h-4 bg-stone-200 rounded" />
        <div className="h-4 bg-stone-200 rounded w-5/6" />
        <div className="h-3 bg-stone-200 rounded w-2/3" />
      </div>
    </div>
  );
}

function ArticleCard({ article, index }) {
  const image = getImage(article, index);
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="card group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
    >
      <div className="h-48 overflow-hidden bg-stone-100 shrink-0">
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]; }}
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-green-700 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full">
            BBC News
          </span>
          <span className="text-xs text-stone-400">{formatDate(article.pubDate)}</span>
        </div>
        <h3 className="font-semibold text-stone-900 leading-snug mb-2 line-clamp-2 group-hover:text-green-800 transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-stone-500 line-clamp-3 flex-1">{stripHtml(article.description)}</p>
        <div className="mt-4 text-sm font-medium text-green-700 flex items-center gap-1 group-hover:gap-2 transition-all">
          Read Article <span aria-hidden="true">→</span>
        </div>
      </div>
    </a>
  );
}

function FeaturedCard({ article }) {
  const image = getImage(article, 0);
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 block"
    >
      <div className="h-72 sm:h-96 bg-cover bg-center" style={{ backgroundImage: `url('${image}')` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-semibold bg-green-600 px-3 py-1 rounded-full uppercase tracking-wide">BBC News</span>
          <span className="text-xs text-white/60">{formatDate(article.pubDate)}</span>
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold leading-snug mb-2 group-hover:text-green-300 transition-colors">
          {article.title}
        </h2>
        <p className="text-sm text-white/70 line-clamp-2 max-w-2xl">{stripHtml(article.description)}</p>
        <div className="mt-4 text-sm font-medium text-green-400 flex items-center gap-1 group-hover:gap-2 transition-all">
          Read Full Article <span>→</span>
        </div>
      </div>
    </a>
  );
}

export default function NewsPage() {
  const { data, loading, error, refetch } = useFetch(NEWS_URL);
  const [search, setSearch] = useState('');

  const items = useMemo(() => parseRSS(data), [data]);
  const filtered = search.trim()
    ? items.filter((a) => a.title?.toLowerCase().includes(search.toLowerCase()))
    : items;
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="page-wrapper bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
          <div className="flex-1">
            <span className="section-label">Live News Feed</span>
            <h1 className="font-serif text-4xl font-bold text-stone-900 mt-2">Environmental News</h1>
            <p className="text-stone-500 mt-1 text-sm">Latest climate coverage from BBC News · Updated live</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 sm:w-64 pl-9 pr-4 py-2 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
            </div>
            <button
              onClick={refetch}
              className="p-2 rounded-xl border border-stone-200 bg-white text-stone-500 hover:text-green-700 hover:border-green-200 transition-colors"
              title="Refresh feed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-8">
            <p className="text-red-700 font-medium">Failed to load news feed</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
            <button onClick={refetch} className="mt-4 px-5 py-2 bg-red-600 text-white text-sm rounded-full hover:bg-red-700">Try Again</button>
          </div>
        )}

        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-stone-500">
            <div className="text-4xl mb-3">🌿</div>
            <p className="font-medium">No articles match &ldquo;{search}&rdquo;</p>
            <button onClick={() => setSearch('')} className="mt-4 text-green-700 text-sm hover:underline">Clear search</button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            {featured && !search && <div className="mb-6"><FeaturedCard article={featured} /></div>}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(search ? filtered : rest).map((article, i) => (
                <ArticleCard key={article.link || i} article={article} index={i} />
              ))}
            </div>
          </>
        )}

        <p className="text-xs text-stone-400 text-center mt-10">
          News sourced from BBC Science &amp; Environment via RSS · proxied by allorigins.win · All rights belong to original publishers
        </p>
      </div>
    </div>
  );
}
