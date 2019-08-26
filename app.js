const express = require('express');
const path = require("path");

//Initialize App
const app = express();

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Home Route
app.get('/', function(req, res){
    res.render('index')
})



//Start server
app.listen(3000, () => {
    console.log('The application is running on localhost:3000!')
});