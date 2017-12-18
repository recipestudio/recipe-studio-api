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

/* GET ingredients listing. */
router.get('/', (req, res) => {
  res.status(400).json({'message': 'Invalid request: no ingredient ID specified'});
});

// GET all ingredients
router.get('/all', mongoGetAll);

// GET ingredient by :id
router.get('/:id', mongoGet);

// POST create new ingredient
router.post('/new', mongoPost);


// DATABASE FUNCTIONS

// DB create function
function mongoPost(req, res, next) {
  let d = new Date();
  console.log('creating at ', d);

  let newItem = {
    'name': req.body.name,
    'created': d,
    'category': req.body.category
  };
  
  // connect to DB here
  try {
    MongoClient.connect(db_conn_str, (err, db) => {
      assert.equal(null, err, 'Could not connect to db');
      
      // insert into db
      db.db('recipe-studio')
        .collection('ingredients')
        .insertOne(newItem, (err, result) => {
          assert.equal(null, err);
          assert.equal(1, result.insertedCount);
          
          // send response data
          res.status(201).json(newItem);
      });

      db.close();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({'message': 'Error creating ingredient', 'error': err});
  } 
}

// DB read one function
function mongoGet(req, res, next) {
  let mongodb = require('mongodb');

  // check for correct ID length
  let iid = req.params.id;
  if (iid.length != 24) {
    res.status(400).json({'message': 'Invalid ingredient ID'});
    return;
  }

  // connect to db
  try {
    MongoClient.connect(db_conn_str, (err, db) => {
      assert.equal(null, err, 'Could not connect to db');

      db.db('recipe-studio')
        .collection('ingredients')
        .findOne({ _id: new mongodb.ObjectID(iid) }, (err, ingredient) => {
          if (!ingredient) {
            res.status(404).json({ 'message': 'Ingredient ' + iid + ' not found' });

          } else {
            // send response data
            res.status(200).json(ingredient);
          }
      });

      db.close();
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({'message': 'Error fetching ingredient', 'error': err});
  }
}

// DB read all function
function mongoGetAll(req, res, next) {
  
  // connect to db
  try {
    MongoClient.connect(db_conn_str, (err, db) => {
      assert.equal(null, err, 'Could not connect to db');

      db.db('recipe-studio')
        .collection('ingredients')
        .find({}).toArray((err, ingredients) => {
          // send response data
          if (err) {
            res.status(500).json( {'message': 'Error getting data', 'error': err} );
          } else {
            res.status(200).json(resData);
          }
      });

      db.close();
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({'message': 'Error fetching ingredients', 'error': err});
  }
}

module.exports = router;