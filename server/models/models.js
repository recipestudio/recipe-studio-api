module.exports = function(mongoose) {
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;

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

  var models = {
    Recipe        :   mongoose.model('Recipe', Recipe)
  };

  return models;
};
