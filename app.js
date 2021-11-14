const express = require('express');
const logger = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express();
require('dotenv').config()

// connecting to mongo
// mongoose.connect(process.env.connectionString)
//   .then(() => console.log('connected to mongodb...'))
//   .catch(err => console.log(err))

// adding middlewares
app.use(logger())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

/******************************************
 ***  Setting up routes
 ******************************************/

// app.use('/incidents', require('./routes/incident'))

//Angular ---------------
// app.use(express.static(process.cwd()+"/client/dist/Team-project/"));
// app.get('/', (req,res) => {
//   res.sendFile(process.cwd()+"/client/dist/Team-project/index.html")
// });
app.get("/", (req, res) => {
  res.send(process.env.connectionString)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({"error": "Not Found!"})
});

// error handler
app.use(function(err, req, res, next) {
  res.status(500).json({"error": "Internal Server Error!"})
});

module.exports = app;