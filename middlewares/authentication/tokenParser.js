const admin = require("../../utils/firebase");

module.exports = async (req, res, next) => {
	try {
		req.user = undefined;

		const authHeader = req.get("Authorization");

		if (!authHeader) {
			return next();
		}

		const token = authHeader.split(" ");

		if (token.length !== 2) {
			const err = new Error("Invalid token");
			err.statusCode = 400;
			throw err;
		}

		if (token[0] !== "Bearer") {
			const err = new Error("Invalid token type");
			err.statusCode = 400;
			throw err;
		}

		let user;

		try {
			const decodedToken = await admin.auth().verifyIdToken(token[1]);
			user = await admin.auth().getUser(decodedToken.uid);
			console.log(user);
		} catch (err) {
			err.statusCode = 500;
			throw err;
		}

		req.user = user;

		next();
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
