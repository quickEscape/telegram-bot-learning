const admin = require('firebase-admin');

// Fetch the service account key JSON file contents
const serviceAccount = require('./serviceAccountKey.json');

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://redirect-bot-bf5fc.firebaseio.com'
});

const db = admin.firestore();

module.exports.db = db;
