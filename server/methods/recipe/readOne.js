var Recipe = require('../../models/recipe.js');

module.exports = function(req, res) {
  // Get recipe id
  console.log("Requested id: \n" + req.params.id + "\n");

  // Match with database
  Recipe.findById(req.params.id, function(err, recipe) {
    if (err) {
      console.error(err);
      res.send(err);
    } else {
      console.log("Results: \n" + JSON.stringify(recipe) + "\n");
      res.json(recipe)
    }
  });
};
