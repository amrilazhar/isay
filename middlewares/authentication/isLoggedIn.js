module.exports = (req, res, next) => {
	try {
		if (req.user) {
			const error = new Error("You are already logged in");
			error.statusCode = 401;
			throw error;
		}

		next();
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
