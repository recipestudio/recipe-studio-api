var express = require('express');
var router = express.Router();

/* GET all recipes */
router.get('/', (req, res) => {
  res.status(200).json({'recipes': []});
});

// GET recipe by :id
router.get('/:id', (req, res) => {
  res.status(200).json( 
    {
      'recipe': {
        'id': (req.params.id),
        'name': 'recipeName',
        'author': 'recipeAuthorUser',
        'created': 'recipeCreatedDate',
        'ingredients': [
          {
            'ingredient': 'ingredientId',
            'quantity': 'ingredientQuantity'
          }
        ],
        'directions': 'recipeDirections'
      }
    } 
  );
});

// POST create new recipe
router.post('/new', (req, res) => {

});

// PUT edit recipe
router.put('/:id', (req, res) => {

});

// DELETE recipe
router.delete('/:id', (req, res) => {

});

module.exports = router;
