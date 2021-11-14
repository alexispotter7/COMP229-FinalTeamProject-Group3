const express = require('express');
const logger = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express();
require('dotenv').config()

// connecting to mongo
mongoose.connect(process.env.connectionString)
  .then(() => console.log('connected to mongodb...'))
  .catch(err => console.log(err))

// adding middlewares
app.use(logger())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

/******************************************
 ***  Setting up routes
 ******************************************/

app.use('/incidents', require('./routes/incident'))

//Angular ---------------
// app.use(express.static(process.cwd()+"/client/dist/Team-project/"));
// app.get('/', (req,res) => {
//   res.sendFile(process.cwd()+"/client/dist/Team-project/index.html")
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({"error": "Not Found!"})
});

// error handler
app.use(function(err, req, res, next) {
  res.status(500).json({"error": err.message})
});

module.exports = app;
