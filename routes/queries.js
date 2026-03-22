const express = require("express");
const router = express.Router();

// Импорт моделей
const Author = require("../models/author");
const Book = require("../models/book");

/* GET main queries page */
router.get("/", (req, res, next) => {
  res.send("<h1>Queries Home</h1><p>Use /author or /books with query params.</p>");
});

/* GET authors by first_name and/or family_name */
router.get("/author", async (req, res, next) => {
  try {
    const firstName = req.query["first_name"];
    const familyName = req.query["family_name"];

    let query = {};
    if (firstName) query.first_name = RegExp(firstName, "i");
    if (familyName) query.family_name = RegExp(familyName, "i");

    const authors = await Author.find(query);

    if (authors.length > 0) {
      const result = `<ul>${authors.map(a => `<li>${a.name}</li>`).join('')}</ul>`;
      res.send(result);
    } else {
      res.send("<h1>Not found</h1>");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("<h1>Server error</h1>");
  }
});

/* GET books by title (populating author name) */
router.get("/books", async (req, res, next) => {
  try {
    const titleQuery = req.query["title"];
    let query = {};
    if (titleQuery) query.title = RegExp(titleQuery, "i");

    const books = await Book.find(query).populate("author");

    if (books.length > 0) {
      const result = `<ul>${books.map(b => `<li>${b.title} by ${b.author.name}</li>`).join('')}</ul>`;
      res.send(result);
    } else {
      res.send("<h1>Not found</h1>");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("<h1>Server error</h1>");
  }
});

module.exports = router;