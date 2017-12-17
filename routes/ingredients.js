var express = require('express');
var router = express.Router();

/* GET ingredients listing. */
router.get('/', (req, res) => {
  res.status(200).json({'ingredients': []});
});

// GET ingredient by :id
router.get('/:id', (req, res) => {
  res.status(200).json( 
    {
      'ingredient': {
        'id': (req.params.id),
        'name': 'ingredientName'
      }
    } 
  );
});

// POST create new ingredient
router.post('/new', (req, res) => {
  // create new ingredient
});

module.exports = router;
