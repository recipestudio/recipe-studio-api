var Recipe = require('../../models/recipe.js');

module.exports = function(req, res) {
  // Get object containing updated params from request
  update = req.body;

  // match id with records and update
  Recipe.findByIdAndUpdate(req.params.id, update, function(err) {
    if (err) {
      console.error(err);
      res.send(err);
    } else {
      console.log("Successfully updated record " + req.params.id);
      res.send("Successfully updated record " + req.params.id);
    }
  });
};
