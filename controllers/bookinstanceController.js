const BookInstance = require("../models/bookinstance");
const asyncHandler = require("express-async-handler");

// Список екземплярів книг
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
  const allBookInstances = await BookInstance.find().populate("book").exec();

  res.render("bookinstance_list", {
    title: "Список екземплярів книг",
    bookinstance_list: allBookInstances,
  });
});

// Деталі екземпляра книги
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();

  if (bookInstance === null) {
    const err = new Error("Екземпляр книги не знайдено");
    err.status = 404;
    return next(err);
  }

  res.render("bookinstance_detail", {
    title: "Деталі екземпляра книги",
    bookInstance: bookInstance,
  });
});
const { body, validationResult } = require("express-validator");
const Book = require("../models/book");

// GET форма
exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find().sort({ title: 1 }).exec();

  res.render("bookinstance_form", {
    title: "Створити екземпляр книги",
    book_list: allBooks,
  });
});

// POST форма
exports.bookinstance_create_post = [
  body("book").trim().isLength({ min: 1 }).escape(),
  body("imprint").trim().isLength({ min: 1 }).escape(),
  body("status").optional().escape(),
  body("due_back").optional({ values: "falsy" }).isISO8601().toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      const allBooks = await Book.find().sort({ title: 1 }).exec();

      return res.render("bookinstance_form", {
        title: "Створити екземпляр книги",
        book_list: allBooks,
        bookinstance: bookInstance,
        errors: errors.array(),
      });
    }

    await bookInstance.save();
    res.redirect(bookInstance.url);
  }),
];