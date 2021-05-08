module.exports = (req, res, next) => {

	if (!req.user) {
		const error = new Error('Not authenticated');
		error.statusCode = 401;
		throw error;
	}

	next();
};
