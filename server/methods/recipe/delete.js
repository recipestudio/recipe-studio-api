var Recipe = require('../../models/recipe.js');

module.exports = function(req, res) {
  // Get recipe id, check with database and delete
  Recipe.remove({_id: req.params.id}, function(err) {
    if (err) {
      // Send response if successful or if failed
      console.error(err);
      res.send(err);
    } else {
      console.log("Successfully updated record " + req.params.id);
      res.send("Success: " + req.params.id + " was deleted from records");
    }
  });
};
