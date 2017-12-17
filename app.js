var express = require('express');
var bodyParser = require('body-parser');
require('dotenv').config();

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var mongoose = require('mongoose');
var db_string = (process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_TABLE);
mongoose.connect(db_string);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  var recipeModel = require('./models/recipe.js')(mongoose);

  var defaultRoutes = require('./routes/default.js');
  var recipeRoutes = require('./routes/recipe.js');
  app.use('/v1', defaultRoutes);
  app.use('/v1/recipe', recipeRoutes);

  var server = app.listen(process.env.APP_PORT, function() {
    console.log('Listening on port %s...', server.address().port);
  });
});
