import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ArticlePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stateArticle = location.state?.article;
    if (stateArticle) {
      setArticle(stateArticle);
      localStorage.setItem('lastArticle', JSON.stringify(stateArticle));
    } else {
      const saved = localStorage.getItem('lastArticle');
      if (saved) {
        setArticle(JSON.parse(saved));
      }
    }
  }, [location.state]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description || '',
          url: article.url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyLink();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(article.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!article) {
    return (
      <div style={{ padding: '1rem' }}>
        <h2>No article found</h2>
        <button onClick={() => navigate('/')}>← Back to Home</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: 'auto', position: 'relative' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
        ← Back
      </button>

      <h1>{article.title}</h1>

      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt={article.title}
          style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
        />
      )}

      <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
        {article.content || article.description || 'No content available.'}
      </p>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#007bff' }}
        >
          View full article →
        </a>

        <button
          onClick={handleShare}
          style={{
            background: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          📤 Share
        </button>

        {!navigator.share && (
          <button
            onClick={copyLink}
            style={{
              background: '#28a745',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📋 Copy Link
          </button>
        )}
      </div>

      {copied && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#333',
            color: '#fff',
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            zIndex: 1000,
            animation: 'fadeInOut 2s ease-in-out'
          }}
        >
          ✅ Link copied to clipboard!
        </div>
      )}

      {/* Fade animation (inject this in your CSS file or <style> tag) */}
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; }
            100% { opacity: 0; transform: translateY(20px); }
          }
        `}
      </style>
    </div>
  );
};

export default ArticlePage;
