const jwt = require("jsonwebtoken");
const User = require("../models/users");

module.exports.tokenDecoder = async (req) => {
	try {
		const authHeader = req.get("Authorization");

		if (!authHeader) {
			const err = new Error("Not Authenticated");
			err.statusCode = 401;
			throw err;
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
			const decodedToken = jwt.verify(token[1], process.env.JWT_SECRET);
			user = await User.findOne({_id: decodedToken.id}).select("id profile email").populate('profile');
		} catch (err) {
			err.statusCode = 500;
			throw err;
		}

		return user;

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
	}
};
