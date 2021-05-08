const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// On sign up.
exports.processSignUp = functions.auth.user().onCreate((user) => {
	// Check if user meets role criteria.
	if (user.email) {
		const customClaims = {
			admin: false,
		};

		if (user.email.endsWith("@isay.gabatch11.my.id")) {
			customClaims.admin = true;
		}

		return admin
			.auth()
			.setCustomUserClaims(user.uid, customClaims)

			.catch((error) => {
				console.log(error);
			});
	}
});
