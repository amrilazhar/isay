const validator = require("validator");
const mongoose = require("mongoose");

class CommentValidator {
	async commentValidate(req, res, next) {
		try {
			let act = req.route.path;
			let errors = [];

			if (act === "/") {
				if (!mongoose.Types.ObjectId.isValid(req.body.status_id)) {
					errors.push("Status id not valid");
				}
			}

			if (errors.length == 1) {
				return res.status(400).json({
					message: errors,
				});
			}
			if (errors.length > 1) {
				return res.status(400).json({
					message: errors.join(",and "),
				});
			}
			// Go to next
			next();
		} catch (err) {
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
	async updateValidate(req, res, next) {
		try {
			let act = req.route.path;
			let errors = [];

			if (act === "/:id") {
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					errors.push("Comment not found");
				}
			}

			if (errors.length > 0) {
				return res.status(400).json({
					message: errors,
				});
			}
			// Go to next
			next();
		} catch (err) {
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
	async likeValidate(req, res, next) {
		try {
			let act = req.route.path;
			let errors = [];

			if (act === "/addLike/:id" || act === "/removeLike/:id") {
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					errors.push("Comment is not found");
				}
			}

			if (errors.length > 0) {
				return res.status(400).json({
					message: errors,
				});
			}
			// Go to next
			next();
		} catch (err) {
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
}

module.exports = new CommentValidator();
