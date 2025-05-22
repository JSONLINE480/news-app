// src/components/NewsCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NewsCard = ({ article, index, onFavorite, isFavorite }) => {
  const navigate = useNavigate();

  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.description,
      url: article.url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(article.url);
        alert('Link copied to clipboard!');
      } catch (err) {
        alert('Failed to copy link');
      }
    }
  };

  const openArticle = () => {
    navigate(`/article/${index}`, {
      state: { article },
    });
    localStorage.setItem('lastArticle', JSON.stringify(article));
  };

  return (
    <div className="card">
      {article.urlToImage && (
        <img src={article.urlToImage} alt={article.title} className="card-img" />
      )}
      <div className="card-content">
        <h3>{article.title}</h3>
        <p>{article.description}</p>
        <div className="card-buttons">
          <button onClick={openArticle}>Read More</button>
          <button onClick={() => onFavorite(article)}>
            {isFavorite ? '💔 Unsave' : '❤️ Save'}
          </button>
          <button onClick={handleShare}>🔗 Share</button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
