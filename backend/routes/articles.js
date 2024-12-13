const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Article = require('../models/Article');

// Get all articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name');
    res.json(articles);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get single article
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name')
      .populate('comments.user', 'name');
    if (!article) return res.status(404).json({ msg: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create article (protected route)
router.post('/', auth, async (req, res) => {
  try {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id,
      tags: req.body.tags
    });

    const article = await newArticle.save();
    res.json(article);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router; 