<Link
  to={`/article/${encodeURIComponent(article.title)}`}
  state={{ article }}
  onClick={() => localStorage.setItem('lastArticle', JSON.stringify(article))}
>
  <button>📖 Read More</button>
</Link>
