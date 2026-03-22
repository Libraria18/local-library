const Author = require("../models/author");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ family_name: 1 }).exec();

  res.render("author_list", {
    title: "Список авторів",
    author_list: allAuthors,
  });
});

exports.author_detail = asyncHandler(async (req, res, next) => {
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    const err = new Error("Автора не знайдено");
    err.status = 404;
    return next(err);
  }

  res.render("author_detail", {
    title: "Деталі автора",
    author: author,
    author_books: allBooksByAuthor,
  });
});

exports.author_create_get = (req, res, next) => {
  res.render("author_form", { title: "Створити автора" });
};

exports.author_create_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 }).withMessage("Ім'я повинно бути вказано.")
    .isAlphanumeric().withMessage("Ім'я містить неалфанумерні символи.")
    .escape(),

  body("family_name")
    .trim()
    .isLength({ min: 1 }).withMessage("Прізвище повинно бути вказано.")
    .isAlphanumeric().withMessage("Прізвище містить неалфанумерні символи.")
    .escape(),

  body("date_of_birth", "Недійсна дата народження")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  body("date_of_death", "Недійсна дата смерті")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    if (!errors.isEmpty()) {
      return res.render("author_form", {
        title: "Створити автора",
        author: author,
        errors: errors.array(),
      });
    }

    await author.save();
    res.redirect(author.url);
  }),
];
// GET
exports.author_delete_get = asyncHandler(async (req, res, next) => {
  const [author, author_books] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }).exec(),
  ]);

  if (author === null) {
    return res.redirect("/catalog/authors");
  }

  res.render("author_delete", {
    title: "Видалити автора",
    author,
    author_books,
  });
});


// POST
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  const [author, author_books] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }).exec(),
  ]);

  if (author_books.length > 0) {
    return res.render("author_delete", {
      title: "Видалити автора",
      author,
      author_books,
    });
  }

  await Author.findByIdAndDelete(req.body.authorid);
  res.redirect("/catalog/authors");
});