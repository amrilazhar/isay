module.exports = (req, res, next) => {
	req.profile = { id: req.user.profile };
	next();
};
