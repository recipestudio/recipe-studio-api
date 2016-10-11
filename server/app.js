var express = require('express');
var bp = require('body-parser');

var app = express();
app.use(bp.json());
app.use(bp.urlencoded({extended: true}));

var mongoose = require('mongoose');
mongoose.connect('mongodb://myfood:myfood@ds033337.mongolab.com:33337/myfood');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  var models = require('./models/models.js')(mongoose);
  var routes = require('./routes/routes.js')(app, mongoose, models);
  var server = app.listen(80, function() {
    console.log('Listening on port %s...', server.address().port);
  });
});
