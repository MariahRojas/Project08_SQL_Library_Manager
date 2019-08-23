const express = require('express')
const app = express()

/* data.json file */
const { books } = require('./data.json');

/* middleware */
app.set('view engine', 'pug')
app.use('/static', express.static('public'))

/* routes */
app.get('/', function (req, res) {

})












const portNumber = 3000

app.listen(portNumber)
console.log('App started on a localhost at port ' + portNumber);