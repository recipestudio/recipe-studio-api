var express = require('express');
var router = express.Router();

// default route
router.get('/', function(req, res) {
  res.send('MyFood server is running!');
});

module.exports = router;
