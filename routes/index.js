const express = require('express');
const router = express.Router();

// GET домашньої сторінки
router.get('/', (req, res) => {
  res.redirect('/catalog');
});

// Новий маршрут для my-page українською
router.get('/my-page', (req, res) => {
  res.render('my_page', {
    title: 'Мій маршрут',  // український заголовок
    items: ['Елемент 1', 'Елемент 2', 'Елемент 3'] // список українською
  });
});

module.exports = router;