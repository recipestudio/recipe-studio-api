var express = require('express');
var router = express.Router();

/* Firebase authentication */

var admin = require("firebase-admin");

let serviceAccount = {
  private_key: (process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')),
  client_email: process.env.FIREBASE_CLIENT_EMAIL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://recipe-studio.firebaseio.com"
});


/* GET users listing. */
router.get('/', (req, res) => {
  res.status(400).json({'message': 'No user ID sent!'});
});

// GET user by :id
router.get('/:id', (req, res) => {
  /* res.status(200).json(
    {
      'id': (req.params.id),
      'name': 'userName',
      'created': 'userCreatedDate'
    }
  ); */

  let uid = req.params.id;

  admin.auth().getUser(uid)
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log("Successfully fetched user data:", userRecord.toJSON());
    res.status(200).json(userRecord.toJSON());
  })
  .catch(function(error) {
    console.log("Error fetching user data:", error);
  });
});

// POST create user
router.post('/new', (req, res) => {

  let newUserData = {
    'email': req.body.email,
    'name': req.body.name || req.body.email,
    'password': req.body.password
  }

  admin.auth().createUser({
    email: newUserData.email,
    emailVerified: false,
    password: newUserData.password,
    displayName: newUserData.name,
    disabled: false
  })
    .then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      //console.log("Successfully created new user:", userRecord.uid);
      res.status(201).json({'message': 'successfully created user', 'uid': userRecord.uid});
    })
    .catch(function(error) {
      console.error("Error creating new user:", error);
      res.status(500).json({'message': 'error creating user', 'error': error});
    });
  
});

module.exports = router;
