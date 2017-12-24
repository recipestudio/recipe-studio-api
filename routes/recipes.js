var express = require("express");
var router = express.Router();

var assert = require("assert");
var fetch = require("node-fetch");

var MongoClient = require("mongodb").MongoClient;
var db_conn_str = process.env.DB_CONN_STR;
if (!db_conn_str) {
  console.error("DB_CONN_STR variable not set!");
}

const APIurl = "https://api.recipe.studio/";

// GET: default
router.get("/", (req, res, next) => {
  res.status(400).json({
    message: "No recipe id was sent. Use /recipe/all for all recipes"
  });
});

// GET: get all recipes
router.get("/all", mongoGetAll);

// GET: get recipes from search
router.get("/search", mongoSearch);

// GET: get recipe by :id
router.get("/:id", mongoGet);

// POST: create recipe
router.post("/new", mongoPost);

// PUT: update recipe by :id
router.put("/:id", mongoPut);

// DELETE: delete recipe by :id
router.delete("/:id", mongoDel);

// DB read one function
function mongoGet(req, res, next) {
  let mongodb = require("mongodb");

  // check for correct ID length
  let rid = req.params.id;
  if (rid.length != 24) {
    res.status(400).json({ message: "Invalid recipe ID" });
    return;
  }

  // connect to db
  try {
    MongoClient.connect(db_conn_str, (err, db) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Could not connect to database" });
      } else {
        db
          .db("recipe-studio")
          .collection("recipes")
          .findOne({ _id: new mongodb.ObjectID(rid) }, (err, recipe) => {
            // send response data
            if (!recipe) {
              res.status(404).json({ message: "Recipe " + rid + " not found" });
            } else {
              res.status(200).json(recipe);
            }
          });
      }

      db.close();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching recipes", error: err });
  }
}

// DB read all function
function mongoGetAll(req, res, next) {
  // connect to db
  try {
    MongoClient.connect(db_conn_str, (err, db) => {
      assert.equal(null, err, "Could not connect to db");

      db
        .db("recipe-studio")
        .collection("recipes")
        .find({})
        .toArray((err, recipes) => {
          res.status(200).json(recipes);
        });

      db.close();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching recipes", error: err });
  }
}

function mongoSearch(req, res, next) {
  // check if getting user recipes
  let searchObj = {};
  if (req.query.user) {
    searchObj["author.uid"] = req.query.user;
  }

  if (req.query.servings) {
    searchObj.servings = req.query.servings;
  }

  if (req.query.ingredients) {
    let ingQuery = req.query.ingredients;
    ingQuery = ingQuery.split(",");

    searchObj["ingredients.data._id"] = { $all: ingQuery };
  }

  // connect to db
  try {
    MongoClient.connect(db_conn_str, (err, db) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ message: "Error connecting to database", error: err });
      } else {
        db
          .db("recipe-studio")
          .collection("recipes")
          .find(searchObj)
          .toArray((err, recipes) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: err });
            }
            res.status(200).json(recipes);
          });

        db.close();
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting recipes", error: err });
  }
}

// DB delete function
function mongoDel(req, res, next) {
  let mongodb = require("mongodb");

  // check for correct ID length
  let rid = req.params.id;
  if (rid.length != 24) {
    res.status(400).json({ message: "Invalid recipe ID" });
    return;
  }

  // connect to db
  try {
    MongoClient.connect(db_conn_str, (err, db) => {
      assert.equal(null, err, "Could not connect to db");

      db
        .db("recipe-studio")
        .collection("recipes")
        .deleteOne({ _id: new mongodb.ObjectID(rid) }, (err, r) => {
          assert.equal(null, err, "Could not delete recipe: " + err);

          res.status(200).json({ message: "Deleted recipe" });
        });

      db.close();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting recipe", error: error });
  }
}

// DB create function
function mongoPost(req, res, next) {
  let d = new Date();

  formObject(req).then(newObj => {
    // connect to DB here
    try {
      MongoClient.connect(db_conn_str, (err, db) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .json({ message: "Could not connect to database", error: err });
        }

        // insert into db
        db
          .db("recipe-studio")
          .collection("recipes")
          .insertOne(newObj, (err, result) => {
            // send response data
            if (err) {
              console.error(err);
              res
                .status(500)
                .json({ message: "Error fetching data", error: err });
            } else if (result.insertedCount != 1) {
              res.status(500).json({ message: "Could not create recipe" });
            } else {
              res.status(200).json(newObj);
            }
          });
        db.close();
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating recipe", error: err });
    }
  });
}

// DB update function
function mongoPut(req, res, next) {
  let mongodb = require("mongodb");

  // check for correct ID length
  let rid = req.params.id;
  if (rid.length != 24) {
    res.status(400).json({ message: "Invalid recipe ID" });
    return;
  }

  formObject(req).then(updateObj => {
    // connect to db
    try {
      MongoClient.connect(db_conn_str, (err, db) => {
        db
          .db("recipe-studio")
          .collection("recipes")
          .updateOne(
            { _id: new mongodb.ObjectID(rid) },
            { $set: updateObj },
            (err, r) => {
              if (err) {
                console.error(err);
                res
                  .status(500)
                  .json({ message: "Error while updating", error: err });
              } else {
                fetch(APIurl + "recipe/" + rid)
                  .then(res => {
                    return res.json();
                  })
                  .then(data => {
                    res.status(200).json(data);
                  });
              }
            }
          );
        db.close();
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Could not update recipe", error: err });
    }
  });
}

function formObject(req) {
  let objFields = {};
  if (req.body.name) {
    objFields.name = req.body.name;
  }
  if (req.body.directions) {
    objFields.directions = req.body.directions;
  }
  if (req.body.description) {
    objFields.description = req.body.description;
  }
  if (req.method == "POST") {
    // set initial image
    objFields.image = !req.body.image
      ? "http://via.placeholder.com/600x400"
      : req.body.image;

    // Promise for new object
    return new Promise((resolve, reject) => {
      // set date
      let d = new Date();
      objFields.created = d;

      // set user
      let a = validateAuthor(req.body.author).then(author => {
        objFields.author = author;
      });

      // set ingredients
      let i = validateIngredients(req.body.ingredients).then(ingredients => {
        objFields.ingredients = ingredients;
      });

      Promise.all([a, i]).then(() => {
        // return object
        resolve(objFields);
        reject(objFields);
      });
    });

    // Promise for update object
  } else {
    if (req.body.ingredients) {
      return new Promise((resolve, reject) => {
        validateIngredients(req.body.ingredients)
          .then(ingredients => {
            objFields.ingredients = ingredients;
          })
          .then(() => {
            resolve(objFields);
            reject({});
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve(objFields);
        reject(objFields);
      });
    }
  }
}

// Check author against database
function validateAuthor(uid) {
  let author = {};

  return new Promise((resolve, reject) => {
    fetch(APIurl + "user/" + uid)
      .then(res => {
        return res.json();
      })
      .then(author_data => {
        resolve({
          uid: author_data.uid,
          displayName: author_data.displayName
        });
        reject({
          uid: uid,
          displayName: "Unknown"
        });
      });
  });
}

// Check ingredients against database
function validateIngredients(ingredients_array) {
  let ingredients = [];
  let requests = [];

  // for each ingredient, create a promise to get ingredient data and
  //   push new data to array of objects with embedded old data.
  ingredients_array.forEach(i => {
    let promise = fetch(APIurl + "ingredient/" + i.ingredient)
      .then(res => {
        return res.json();
      })
      .then(ingredient_data => {
        ingredients.push({
          data: ingredient_data,
          quantity: i.quantity,
          units: i.units
        });
      });

    // push promise to array of promises
    requests.push(promise);
  });

  return new Promise((resolve, reject) => {
    // execute all promises
    Promise.all(requests).then(() => {
      resolve(ingredients);
      reject({});
    });
  });
}

module.exports = router;
