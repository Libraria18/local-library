// populatedb.js
require('dotenv').config(); // загружаем .env
const mongoose = require('mongoose');

const Genre = require('./models/genre');
const Author = require('./models/author');
const Book = require('./models/book');
const BookInstance = require('./models/bookinstance');

const mongoDB = process.env.MONGO_URI;

if (!mongoDB) {
  console.error('Ошибка: Не передан URL MongoDB в MONGO_URI');
  process.exit(1);
}

mongoose.connect(mongoDB)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function main() {
  console.log('Debug: Starting populatedb script');

  try {
    // --- Очистка всех коллекций ---
    await Genre.deleteMany({});
    await Author.deleteMany({});
    await Book.deleteMany({});
    await BookInstance.deleteMany({});
    console.log('Debug: Cleared existing collections');

    // --- Создание жанров ---
    const genres = [
      { name: 'Fantasy' },
      { name: 'Science Fiction' },
    ];

    const createdGenres = [];
    for (const g of genres) {
      const genre = new Genre(g);
      await genre.save();
      createdGenres.push(genre);
      console.log(`Added genre: ${genre.name}`);
    }

    // --- Создание авторов ---
    const authorsData = [
      { first_name: 'Patrick', family_name: 'Rothfuss' },
      { first_name: 'Isaac', family_name: 'Asimov' },
    ];

    const createdAuthors = [];
    for (const a of authorsData) {
      const author = new Author(a);
      await author.save();
      createdAuthors.push(author);
      console.log(`Added author: ${author.name}`);
    }

    // --- Создание книг ---
    const booksData = [
      {
        title: 'The Name of the Wind',
        author: createdAuthors[0]._id,
        summary: 'Fantasy novel about a young magician.',
        isbn: '9780756404741',
        genre: [createdGenres[0]._id],
      },
      {
        title: 'Foundation',
        author: createdAuthors[1]._id,
        summary: 'Science fiction saga of the Foundation.',
        isbn: '9780553293357',
        genre: [createdGenres[1]._id],
      },
    ];

    const createdBooks = [];
    for (const b of booksData) {
      const book = new Book(b);
      await book.save();
      createdBooks.push(book);
      console.log(`Added book: ${book.title}`);
    }

    // --- Создание экземпляров книг ---
    const bookInstancesData = [
      {
        book: createdBooks[0]._id,
        imprint: 'First Edition, 2007',
        status: 'Available',
      },
      {
        book: createdBooks[1]._id,
        imprint: 'Harper, 1951',
        status: 'Loaned',
      },
    ];

    for (const bi of bookInstancesData) {
      const instance = new BookInstance(bi);
      await instance.save();
      console.log(`Added bookinstance: ${instance.imprint}`);
    }

    console.log('Debug: Finished populating database');
  } catch (err) {
    console.error('Ошибка при заполнении базы:', err);
  } finally {
    await mongoose.connection.close();
    console.log('Debug: Closed mongoose connection');
  }
}

main();