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

module.exports = admin;
