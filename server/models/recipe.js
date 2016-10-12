var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Recipe = new Schema({
  name          :   String,
  ingredients   :   [
    {
      name          :   String,
      ingredient    :   String,
      quantity      :   Number,
      measure       :   String,
    }
  ],
  picture       :   String,
  author        :   String,
});

module.exports = mongoose.model('Recipe', Recipe);
