import React, { useState, useEffect, useCallback } from 'react';
import './styles.css';
import NewsCard from './components/NewsCard';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ArticlePage from './ArticlePage';

const API_KEY = process.env.REACT_APP_NEWS_API_KEY;

function App() {
  const [articles, setArticles] = useState([]);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);
  const [view, setView] = useState('news');
  const [country, setCountry] = useState('us');
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNews = useCallback(async () => {
    if (!API_KEY) {
      setError('API key is missing.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&q=${query}&pageSize=6&page=${page}&apiKey=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === 'ok') {
        setArticles(prev => page === 1 ? data.articles : [...prev, ...data.articles]);
      } else {
        setError(data.message || 'Error fetching news.');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  }, [country, category, query, page]);

  useEffect(() => {
    if (view === 'news') fetchNews();
  }, [country, category, query, page, view, fetchNews]);

  const toggleFavorite = (article) => {
    const exists = favorites.find(fav => fav.url === article.url);
    let updated;
    if (exists) {
      updated = favorites.filter(fav => fav.url !== article.url);
    } else {
      updated = [...favorites, article];
    }
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const currentArticles = view === 'news' ? articles : favorites;

  return (
    <Router>
      <div className={darkMode ? 'dark' : 'light'}>
        <div className="navbar">
          <Link to="/" onClick={() => setView('news')}>📰 JS NEWS</Link>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        <div className="toolbar">
          <button onClick={() => setView('news')} className={view === 'news' ? 'active' : ''}>Latest</button>
          <button onClick={() => setView('favorites')} className={view === 'favorites' ? 'active' : ''}>❤️ Favorites</button>

          {view === 'news' && (
            <>
              <select onChange={(e) => setCountry(e.target.value)} value={country}>
                <option value="us">🇺🇸 USA</option>
                <option value="gb">🇬🇧 UK</option>
                <option value="in">🇮🇳 India</option>
                <option value="au">🇦🇺 Australia</option>
              </select>
              <select onChange={(e) => setCategory(e.target.value)} value={category}>
                <option value="">All</option>
                <option value="business">Business</option>
                <option value="entertainment">Entertainment</option>
                <option value="health">Health</option>
                <option value="science">Science</option>
                <option value="sports">Sports</option>
                <option value="technology">Technology</option>
              </select>
              <input
                type="text"
                placeholder="Search news..."
                value={query}
                onChange={(e) => {
                  setPage(1);
                  setQuery(e.target.value);
                }}
              />
            </>
          )}
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <>
                {loading && <p className="status">Loading...</p>}
                {error && <p className="status error">{error}</p>}
                {!loading && !error && currentArticles.length === 0 && (
                  <p className="status">No articles found.</p>
                )}

                <div className="grid">
                  {currentArticles.map((article, index) => (
                    <NewsCard
                      key={article.url}
                      article={article}
                      index={index}
                      onFavorite={toggleFavorite}
                      isFavorite={favorites.some(fav => fav.url === article.url)}
                    />
                  ))}
                </div>

                {view === 'news' && !loading && articles.length > 0 && (
                  <button className="load-more" onClick={() => setPage(prev => prev + 1)}>Load More</button>
                )}
              </>
            }
          />
          <Route path="/article/:id" element={<ArticlePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
