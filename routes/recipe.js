var express = require('express');
var router = express.Router();

// For data handling
var createRecipe = require('../methods/recipe/create.js');
var readOneRecipe = require('../methods/recipe/readOne.js');
var readAllRecipes = require('../methods/recipe/readAll.js');
var deleteRecipe = require('../methods/recipe/delete.js');
var updateRecipe = require('../methods/recipe/update.js');

// Recipe endpoints
// create
router.post('/new', createRecipe);
router.get('/all', readAllRecipes);

// read
router.get('/id/:id', readOneRecipe);

// update
router.put('/update/:id', updateRecipe);

// delete
router.delete('/delete/:id', deleteRecipe);

module.exports = router;
