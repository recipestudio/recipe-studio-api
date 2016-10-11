var router = function(app, db, models) {
  var objID = db.Schema.ObjectId;

  // default route
  app.get('/v1', function(req, res) {
    res.send('MyFood server is running!');
  });

  // RECIPE ENDPOINTS
  // create
  app.post('/v1/recipe/new', function(req, res) {
    var resp; // response

    // Get data from form
    var r_name = req.body.name;
    var r_ingr = JSON.parse(req.body.ingredients);
    console.log(JSON.stringify(r_ingr));
    var r_pic = req.body.picture;
    var r_author = req.body.user;

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
    return true;
  });

  // read
  app.get('/v1/recipe/id/:id', function(req, res) {
    // Get recipe id
    console.log("Requested id: \n" + req.params.id + "\n");

    // Match with database
    models.Recipe.findById(req.params.id, function(err, recipe) {
      if (err) {
        console.error(err);
        res.send(err);
      } else {
        console.log("Results: \n" + JSON.stringify(recipe) + "\n");
        res.json(recipe)
      }
    });
  });

  app.get('/v1/recipe/all', function(req, res) {
    models.Recipe.find(function(err, recipes) {
      if (err) {
        console.error(err);
        res.send(err);
      } else {
        console.log("Fetched: \n" + JSON.stringify(recipes) + "\n");
        res.json(recipes);
      }
    });
  });

  // update
  app.put('/v1/recipe/update/:id', function(req, res) {
    // Get object containing updated params from request
    update = req.body;

    // match id with records and update
    models.Recipe.findByIdAndUpdate(req.params.id, update, function(err) {
      if (err) {
        console.error(err);
        res.send(err);
      } else {
        console.log("Successfully updated record " + req.params.id);
        res.send("Successfully updated record " + req.params.id);
      }
    });
  });

  // delete
  app.delete('/v1/recipe/delete/:id', function(req, res) {
    // Get recipe id, check with database and delete
    models.Recipe.remove({_id: req.params.id}, function(err) {
      if (err) {
        // Send response if successful or if failed
        console.error(err);
        res.send(err);
      } else {
        console.log("Successfully updated record " + req.params.id);
        res.send("Success: " + req.params.id + " was deleted from records");
      }
    });
  });
};

module.exports = router;
