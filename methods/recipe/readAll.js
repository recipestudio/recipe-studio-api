var Recipe = require('../../models/recipe.js');

module.exports = function(req, res) {
  Recipe.find(function(err, recipes) {
    if (err) {
      console.error(err);
      res.send(err);
    } else {
      console.log("Fetched: \n" + JSON.stringify(recipes) + "\n");
      res.json(recipes);
    }
  });
};
