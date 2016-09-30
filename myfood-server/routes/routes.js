var router = function(app) {
  // default route
  app.get('/', function(req, res) {
    res.send('Hello, world!');
  });


  app.get('/test', function(req, res) {
    var q = req.query.q;
    var response = 'Got the test query! It was: ' + q;
    res.send(response);
  })

}

module.exports = router;
