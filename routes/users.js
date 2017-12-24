var express = require("express");
var router = express.Router();

/* Firebase authentication */
let admin = require("firebase-admin");

let serviceAccount = {
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://recipe-studio.firebaseio.com"
});

/* GET default. */
router.get("/", (req, res) => {
  res.status(400).json({ message: "No user ID sent!" });
});

// GET user by :id
router.get("/:id", (req, res) => {
  let uid = req.params.id;

  admin
    .auth()
    .getUser(uid)
    .then(function(userRecord) {
      let userObj = {
        uid: userRecord.uid,
        displayName: userRecord.displayName,
        creationTime: userRecord.metadata.creationTime
      };

      res.status(200).json(userObj);
    })
    .catch(function(error) {
      console.log("Error fetching user data:", error);
      res
        .status(500)
        .json({ message: "Error fetching user data", error: error });
    });
});

// POST create user
router.post("/new", (req, res) => {
  let newUserData = {
    email: req.body.email,
    name: req.body.name || req.body.email,
    password: req.body.password
  };

  admin
    .auth()
    .createUser({
      email: newUserData.email,
      emailVerified: false,
      password: newUserData.password,
      displayName: newUserData.name,
      disabled: false
    })
    .then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      res.status(201).json(userRecord.toJSON());
    })
    .catch(function(error) {
      console.error("Error creating new user:", error);
      res.status(500).json({ message: "error creating user", error: error });
    });
});

// PUT edit user
router.put("/:id", (req, res) => {
  let userData = {
    uid: req.params.id,
    email: req.body.email || undefined,
    name: req.body.name || undefined,
    password: req.body.password || undefined
  };

  // edit user
  admin
    .auth()
    .updateUser(userData.uid, {
      email: userData.email,
      password: userData.password,
      displayName: userData.name
    })
    .then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      //console.log("Successfully updated user", userRecord.toJSON());
      res.status(200).json(userRecord.toJSON());
    })
    .catch(function(error) {
      console.log("Error updating user:", error);
      res.status(500).json({ message: "Error updating user", error: error });
    });
});

// DELETE user
router.delete("/:id", (req, res) => {
  let uid = req.params.id;
  admin
    .auth()
    .deleteUser(uid)
    .then(function() {
      console.log("Successfully deleted user");
      res.status(200).json({ message: "Successfully deleted user" });
    })
    .catch(function(error) {
      console.log("Error deleting user:", error);
      res.status(500).json({ message: "Error deleting user", error: error });
    });
});

module.exports = router;
