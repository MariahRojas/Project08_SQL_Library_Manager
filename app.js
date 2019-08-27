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
app.get('/', function (req, res) {
    Book.findAll()
        .then((books) => {
            res.render('index', { books: books })
        })
})

//Add New Book Route
app.get('/books/new', function (req, res) {
    res.render('new-book')
})

//Add Submit POST Route
app.post('/books/new', function (req, res) {
    console.log('Submit') //Submiting to the server
    return;
})

//Book Detail Route
app.get('/books/update/', function (req, res) {
    res.render('update-book')
})

/* Define a Model */
//Books Model
// class Book extends Sequelize.Model {}
// Book.init({ //Initialize a model. Call the static class init() method on the model name (Book) to initialize and configure the model:
//     title: Sequelize.STRING
// }, { sequelize }); // same as { sequelize: sequelize }

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
    res.render('error');
    console.log(err.status);
}); 

sequelize.sync()
    .then(() => {
        console.log('Connection to the database successful!');
        //Start server
        app.listen(3000, () => {
            console.log('The application is running on localhost:3000!')
        });
    })