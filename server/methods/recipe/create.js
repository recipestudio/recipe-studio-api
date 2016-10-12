var Recipe = require('../../models/recipe.js');

module.exports = function(req, res) {
  var resp; // response

  // Get data from form
  var r_name = req.body.name;
  var r_ingr = JSON.parse(req.body.ingredients);
  console.log(JSON.stringify(r_ingr));
  var r_pic = req.body.picture;
  var r_author = req.body.user;

  // Create recipe object and send to database
  var newRecipe = new Recipe({
    name: r_name,
    ingredients: r_ingr,
    picture: r_pic,
    author: r_author,
  });

  var save_resp;
  newRecipe.save(function(err, item) {
    if (err) {
      console.error(err);
      res.send(err);
    } else {
      console.log("Successfully created record: " + newRecipe.id);
      res.send("Successfully created record: " + newRecipe.id);
    }
  });

  // Return stuff
  resp = 'You created a recipe with the following: \n' + JSON.stringify(save_resp);
  console.log(resp);
  res.json(save_resp);
};
