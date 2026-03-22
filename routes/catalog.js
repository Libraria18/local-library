const express = require("express");
const router = express.Router();

const book_controller = require("../controllers/bookController");
const author_controller = require("../controllers/authorController");
const genre_controller = require("../controllers/genreController");
const bookinstance_controller = require("../controllers/bookinstanceController");

// HOME
router.get("/", book_controller.index);

// AUTHOR CREATE
router.get("/author/create", author_controller.author_create_get);
router.post("/author/create", author_controller.author_create_post);

// GENRE CREATE
router.get("/genre/create", genre_controller.genre_create_get);
router.post("/genre/create", genre_controller.genre_create_post);

// BOOK CREATE
router.get("/book/create", book_controller.book_create_get);
router.post("/book/create", book_controller.book_create_post);

// BOOKINSTANCE CREATE
router.get("/bookinstance/create", bookinstance_controller.bookinstance_create_get);
router.post("/bookinstance/create", bookinstance_controller.bookinstance_create_post);

// BOOKS
router.get("/books", book_controller.book_list);
router.get("/book/:id", book_controller.book_detail);

// BOOK INSTANCES
router.get("/bookinstances", bookinstance_controller.bookinstance_list);
router.get("/bookinstance/:id", bookinstance_controller.bookinstance_detail);

// AUTHORS
router.get("/authors", author_controller.author_list);
router.get("/author/:id", author_controller.author_detail);

// GENRES
router.get("/genres", genre_controller.genre_list);
router.get("/genre/:id", genre_controller.genre_detail);

module.exports = router;