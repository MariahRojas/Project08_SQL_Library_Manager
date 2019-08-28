const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'movies.db'
});

//Bring in Models
const Book = require('./models').Book

//Initialize App
const app = express();

/* Middleware */
//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/static', express.static('public'))

//Body Parser Middleware
//parse application/x-wwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
//parse application/json
app.use(bodyParser.json())

//Home Route
//changes
app.get("/", (req, res) => {   
    res.redirect("/books");
});
  
app.get('/books', function (req, res) {
    Book.findAll()
        .then((books) => {
            res.render('index', { books: books })
        })
})


// //Add New Book Route
// app.get('/books/new', function (req, res) {
//     res.render('new-book')
// })

//Add Submit POST Route
// app.post('/books/new', function (req, res) {
//     let book = new Book();
//     book.title = req.body.title;
//     book.author = req.body.author;
//     book.genre = req.body.genre;
//     book.year = req.body.year;

//     res.redirect('/');
//     book.save(function(err){
//         if(err.book){
//             console.log(err);
//             return;
//         } else {
//             res.redirect('/');
//         }
//     })
// })

//Add Book route and add submit POST Route
app.get("/books/new", (req, res) => {
    const book = {
      title: "",
      author: "",
      genre: "",
      year: ""
    }
    res.render("new-book", {book});
  });
  
//post new book to database
app.post("/books/new", (req, res) => {
    Book.create(req.body)
        .then(() => {
            res.redirect("/books");
            })
        .catch(err => {
            if (err.name === "SequelizeValidationError") {
                res.render("new-book", { errors: err.errors, book: req.body});
            } else {
                throw err;
            }
        })
        .catch(err => {
            res.render("error", { err });
        });
});
  

//Book Detail Route
app.get("/books/:id", (req, res) => {
    Book.findByPk(req.params.id)
      .then(book => {
        if (!book) {
          const err = new Error("Book not found");
          throw err;
        }
        res.render("update-book", { book, bookId: req.params.id });
      })
      .catch(err => {
        res.render("error", { err });
      });
  });
  

//update book info into database
app.post("/books/:id", (req, res) => {
Book.findByPk(req.params.id)
    .then(book => {
        if (book) {
        return book
            .update(req.body)
            .then(book => {
            res.redirect("/books");
            })
            .catch(err => {
            if (err.name === "SequelizeValidationError") {
                res.render("update-book", {
                errors: err.errors,
                book: req.body,
                bookId: req.params.id
                });
            } else {
                res.render("error", { err });
            }
        });
    } else {
        const err = new Error("The book doesn't exist");
        throw err;
    }
})
.catch(err => {
    res.render("error", { err });
});
});

// //Delete Book
app.post("/books/:id/delete", (req, res) => {
    Book.findByPk(req.params.id)
      .then(book => {
        if (book) {
          return book.destroy();
        } else {
          const err = new Error("The book doesn't exist");
          throw err;
        }
      })
      .then(book => {
        res.redirect("/books");
      })
      .catch(err => {
        res.render("error", { err });
      });
  });

/* Handle errors */
// sets error status when site is not found 
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    console.log("We can't find the page you are looking for!")
    next(err);
});
  
// renders error page
app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    if (err.message === "Page not found") {
        res.render("page-not-found");
    } else {
        res.render("error", { err });
    }
}); 

sequelize.sync()
    .then(() => {
        console.log('Connection to the database successful!');
        //Start server
        app.listen(3000, () => {
            console.log('The application is running on localhost:3000!')
        });
    })