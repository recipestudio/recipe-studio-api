var recipe = require('./recipe.js');
var ingredient = require('./ingredient.js');

var router = function(app) {
  // default route
  app.get('/', function(req, res) {
    res.send('Hello, world!');
  });

  // RECIPE ENDPOINTS
  // create
  app.post('/recipe/new', function(req, res) {
    // Get data from form
    var r_id = req.body.id;
    var r_name = req.body.name;
    var r_ingr = req.body.ingredients;
    var r_pic = req.body.picture;
    var r_author = req.body.user;

    console.log('%s, %s, %s, %s, %s', r_id, r_name, r_ingr, r_pic, r_author);

    // Sanitize and validate data
      // code...

    // Create recipe object and send to database
    // for later: var newRecipe = recipe(r_id, r_name, r_ingr, r_pic, r_author);

    var newRecipe = {
      'id': r_id,
      'name': r_name,
      'ingredients': r_ingr,
      'picture': r_pic,
      'author': r_author
    };

    // Return success or fail
    var resp = 'You created a recipe with the following: ' + JSON.stringify(newRecipe);
    console.log(resp);
    res.redirect('/');
  });

  // read
  app.post('/recipe/get', function(req, res) {
    // Get recipe id

    // Match with database

    // Send response with recipe data if exists, if not then send failure
  });

  // update
  app.post('/recipe/update', function(req, res) {
    // Get recipe id, check with database

    // Get new data, sanitize and validate
      // code...

    // Create new recipe object

    // Update with database

    // Send response if successful or if failed
  });

  // delete
  app.post('/recipe/delete', function(req, res) {
    // Get recipe id, check with database

    // Delete in database

    // Send response if successful or if failed
  });


  // test GET function
  app.get('/test', function(req, res) {
    var q = req.query.q;
    var response = 'Got the test query! It was: ' + q;
    res.send(response);
  });
};

module.exports = router;
