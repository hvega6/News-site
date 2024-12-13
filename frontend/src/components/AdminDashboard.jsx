import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // You'll need to create this

const AdminDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    tags: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [articlesRes, usersRes] = await Promise.all([
        axios.get('/api/articles'),
        axios.get('/api/users')
      ]);
      setArticles(articlesRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/articles', {
        ...newArticle,
        tags: newArticle.tags.split(',').map(tag => tag.trim())
      });
      setNewArticle({ title: '', content: '', tags: '' });
      fetchData();
    } catch (err) {
      console.error('Error creating article:', err);
    }
  };

  if (user?.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <section className="new-article">
        <h2>Create New Article</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Title"
              value={newArticle.title}
              onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
            />
          </div>
          <div>
            <textarea
              placeholder="Content"
              value={newArticle.content}
              onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={newArticle.tags}
              onChange={(e) => setNewArticle({...newArticle, tags: e.target.value})}
            />
          </div>
          <button type="submit">Create Article</button>
        </form>
      </section>

      <section className="manage-articles">
        <h2>Manage Articles</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article._id}>
                <td>{article.title}</td>
                <td>{article.author.name}</td>
                <td>{new Date(article.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(article._id)}>Edit</button>
                  <button onClick={() => handleDelete(article._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard; 