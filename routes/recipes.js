var express = require('express');
var router = express.Router();
var assert = require('assert');

var MongoClient = require('mongodb').MongoClient;
var db_conn_str = process.env.DB_CONN_STR;
if (!db_conn_str) {
  console.error('DB_CONN_STR variable not set!');
} else {
  console.log('Connection string: ', db_conn_str);
}

// GET: default
router.get('/', (req, res, next) => {
  res.status(400).json({'message': 'No recipe id was sent. Use /recipe/all for all recipes'});
});

// GET: get all recipes
router.get('/all', mongoGetAll);

// GET: get recipe by :id
router.get('/:id', mongoGet );

// POST: create recipe
router.post('/new', mongoPost );

// PUT: update recipe by :id
router.put('/:id', mongoPut );

// DELETE: delete recipe by :id
router.delete('/:id', mongoDel );

// DB create function
function mongoPost(req, res, next) {
  let d = new Date();
  console.log('creating at ', d);

  let newItem = {
    'author': req.body.author,
    'name': req.body.name,
    'created': d,
    'ingredients': req.body.ingredients,
    'directions': req.body.directions
  };
  
  // connect to DB here
  try {
    MongoClient.connect(db_conn_str, (err, db) => {
      assert.equal(null, err, 'Could not connect to db');
      
      // insert into db
      db.db('recipe-studio').collection('recipes').insertOne(newItem, (err, result) => {
        assert.equal(null, err);
        assert.equal(1, result.insertedCount);
        
        // send response data
        let resData = {
          'message': 'Recipe created!',
          'data': newItem
        }; res.status(201).json(resData);
      });

      db.close();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({'message': 'Error creating recipe', 'error': err});
  } 
}

// DB read one function
function mongoGet(req, res, next) {
  let mongodb = require('mongodb');

  // check for correct ID length
  let rid = req.params.id;
  if (rid.length != 24) {
    res.status(400).json({'message': 'Invalid recipe ID'});
    return;
  }

  // connect to db
  try {
    MongoClient.connect(db_conn_str, (err, db) => {
      assert.equal(null, err, 'Could not connect to db');

      db.db('recipe-studio')
        .collection('recipes')
        .findOne({ _id: new mongodb.ObjectID(rid) }, (err, recipe) => {
          if (!recipe) {
            res.status(404).json({ 'message': 'Recipe ' + rid + ' not found' });

          } else {
            let resData = {
              message: 'Recipe '+rid,
              data: recipe
            }; res.status(200).json(resData);
          }
      });

      db.close();
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({'message': 'Error fetching recipes', 'error': err});
  }
}

// DB read all function
function mongoGetAll(req, res, next) {
  
  // connect to db
  try {
    MongoClient.connect(db_conn_str, (err, db) => {
      assert.equal(null, err, 'Could not connect to db');

      db.db('recipe-studio')
        .collection('recipes')
        .find({}).toArray((err, recipes) => {
          let resData = {
            message: 'All recipes',
            data: recipes
          }; res.status(200).json(resData);
      });

      db.close();
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({'message': 'Error fetching recipes', 'error': err});
  }
}

// DB update function
function mongoPut(req, res, next) {
  let mongodb = require('mongodb');
  
  // check for correct ID length
  let rid = req.params.id;
  if (rid.length != 24) {
    res.status(400).json({'message': 'Invalid recipe ID'});
    return;
  }

  let updateFields = {};
  if (req.body.name) { updateFields.name = req.body.name; }
  if (req.body.ingredients) { updateFields.ingredients = req.body.ingredients; }
  if (req.body.directions) { updateFields.directions = req.body.directions; }

  // connect to db
  try {
    MongoClient.connect(db_conn_str, (err, db) => {
      db.db('recipe-studio')
        .collection('recipes')
        .updateOne( { _id: new mongodb.ObjectID(rid) }, {$set: updateFields}, (err, r) => {
          if (err) { throw err; }
          res.status(200).json({ 'message': 'Updated recipe '+rid });
        });

      db.close();
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({'message': 'Could not update recipe', 'error': err});
  }
}

// DB delete function
function mongoDel(req, res, next) {
  let mongodb = require('mongodb');

  // check for correct ID length
  let rid = req.params.id;
  if (rid.length != 24) {
    console.log('nope');
    res.status(400).json({'message': 'Invalid recipe ID'});
    return;
  }

  // connect to db
  try {
    MongoClient.connect(db_conn_str, (err, db) => {
      assert.equal(null, err, 'Could not connect to db');
      
      db.db('recipe-studio')
        .collection('recipes')
        .deleteOne({ _id: new mongodb.ObjectID(rid) }, (err, r) => {
          assert.equal(null, err, 'Could not delete recipe: '+err);
          
          res.status(200).json({'message': 'Deleted recipe'});
      });

      db.close();
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({'message': 'Error deleting recipe', 'error': error});
  }
}

module.exports = router;