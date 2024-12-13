import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('/api/articles');
        setArticles(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch articles');
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="article-list">
      {articles.map(article => (
        <div key={article._id} className="article-card">
          <h2>{article.title}</h2>
          <p>{article.content.substring(0, 150)}...</p>
          <div className="article-meta">
            <span>By {article.author.name}</span>
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
          <Link to={`/article/${article._id}`}>Read more</Link>
        </div>
      ))}
    </div>
  );
};

export default ArticleList; 