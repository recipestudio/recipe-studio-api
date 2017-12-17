var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.status(400).json({'message': 'No user ID sent!'});
});

// GET user by :id
router.get('/:id', (req, res) => {
  res.status(200).json(
    {
      'id': (req.params.id),
      'name': 'userName',
      'created': 'userCreatedDate'
    }
  );
});

module.exports = router;
