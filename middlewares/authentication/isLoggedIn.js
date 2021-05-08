module.exports = (req, res, next) => {

	if (req.user) {
		const error = new Error('You are already logged in');
		error.statusCode = 401;
		throw error;
	}

	next();
};
