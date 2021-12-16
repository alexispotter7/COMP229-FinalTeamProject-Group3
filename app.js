const express = require('express');
const logger = require('morgan')
const bodyParser = require('body-parser')
const morgan = require('morgan') // ???
const mongoose = require('mongoose')
const cors = require('cors') // ?????

const app = express();
require('dotenv').config()

// // connecting to mongo
mongoose.connect(process.env.connectionString)
  .then(() => console.log('connected to mongodb...'))
  .catch(err => console.log(err))


// For Test!!!
// let db = require('./db');
//     // Connect to the Database (My Database: JaeukDB)
// mongoose.connect(db.mongodbUri);

// let mongoDB = mongoose.connection;
// mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
// mongoDB.once('open', ()=>{
//   console.log('Connected to MongoDB...');
// });



// adding middlewares
app.use(logger())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

/******************************************
 ***  Setting up routes
 ******************************************/

app.use('/incidents', require('./routes/incident'))
app.use('/users', require('./routes/user'))




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({"error": "Not Found!"})
});

// error handler
app.use(function(err, req, res, next) {
  res.status(500).json({"error": err.message})
});

module.exports = app;