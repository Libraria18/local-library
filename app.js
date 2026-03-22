// app.js
require('dotenv').config(); // Загружаем переменные окружения из .env

const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog'); // Маршруты каталога

const app = express();

// --- Подключение к MongoDB ---
const mongoDB = process.env.MONGO_URI;

mongoose.connect(mongoDB)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Настройка Pug ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// --- Middleware ---
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// --- Роуты ---
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// --- Обработка ошибок 404 ---
app.use((req, res, next) => {
  res.status(404);
  res.render('error', { message: '404 Not Found', error: {} });
});

// --- Обработка других ошибок ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render('error', { message: 'Server Error', error: err });
});

module.exports = app;