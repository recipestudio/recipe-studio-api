var router = function(app, db, models) {
  var objID = db.Schema.ObjectId;

  // default route
  app.get('/', function(req, res) {
    res.send('MyFood server is running!');
  });

  // RECIPE ENDPOINTS
  // create
  app.post('/recipe/new', function(req, res) {
    var resp; // response

    // Get data from form
    //var r_id = req.body.id;
    var r_name = req.body.name;
    var r_ingr = JSON.parse(req.body.ingredients);
    console.log(JSON.stringify(r_ingr));
    var r_pic = req.body.picture;
    var r_author = req.body.user;

    //console.log('>  %s, %s, %s, %s', r_name, r_ingr, r_pic, r_author);

    // Sanitize and validate data
      // code...

    // Create recipe object and send to database
    var newRecipe = new models.Recipe({
      name: r_name,
      ingredients: r_ingr,
      picture: r_pic,
      author: r_author,
    });

    var save_resp;
    newRecipe.save(function(err, item) {
      if (err) {
        console.error(err);
        save_resp = {};
      } else {
        save_resp = item;
      }
    });

    // Return stuff
    resp = 'You created a recipe with the following: \n' + JSON.stringify(save_resp);
    console.log(resp);
    res.json(save_resp);
    return true;
  });

  // read
  app.get('/recipe/:id', function(req, res) {
    var resp; // response

    // Get recipe id
    var r_id = objID(req.params.id);

    // Match with database
    var getRecipe = function(r_id, callback) {
       models.Recipe.find().where('_id', r_id)
        .exec(function(err, items) {
          callback(err, items);
        });
    };

    var recipe = getRecipe(r_id, function(err, items) {
      if (err) {
        console.error(err);
        return null;
      }
      return items;
    });

    // models.Recipe.findOne({_id:r_id}, function(err, item) {
    //   if (err) return console.err(err);
    //   console.log(JSON.stringify(item));
    //   console.log(item);
    // });

    // Send response with recipe data if exists, if not then send failure
    //resp = getData;
    console.log(resp);

    res.contentType('application/json');
    res.json(resp);

  });

  app.get('/recipe/all', function(req, res) {
    var recipes;

    models.Recipe.find(function(err, items) {
      if (err) {
        return console.error(err);
      } else {
        console.log(JSON.stringify(items));
        recipes = JSON.stringify(items);
      }
    });

    console.log(recipes + '\n');
    console.log(JSON.stringify(recipes));
    res.json(recipes);
    res.send(recipes)
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
