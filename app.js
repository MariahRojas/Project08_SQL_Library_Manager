const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

//Initialize App
const app = express();

//Bring in Models
let Books = require('./models/books')

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
app.get('/', function(req, res){
    res.render('index')
})

//Add Route
app.get('/books/new', function(req, res){
    res.render('new-book')
})

//Add Submit POST Route
app.post('/books/new', function(req, res){
    console.log('Submit') //Submiting to the server
    return;
})


//Start server
app.listen(3000, () => {
    console.log('The application is running on localhost:3000!')
});