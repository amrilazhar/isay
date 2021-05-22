const validator = require("validator");
const mongoose = require("mongoose");

class CommentValidator {
	async commentValidate(req, res, next) {
		try {
			let act = req.route.path;
			let errors = [];

			if (act === "/") {
				if (req.body.owner.toString() !== req.profile.id.toString()) {
					errors.push("id owner is not same");
				}
				if (!mongoose.Types.ObjectId.isValid(req.body.status_id)) {
					errors.push(
						"id owner is not same"
					);
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
					errors.push("Comment is not found");
				}
				else if (req.body.owner.toString() !== req.profile.id.toString()) {
					errors.push("id owner is not same");
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
				else if (!mongoose.Types.ObjectId.isValid(req.query.likeBy)) {
					errors.push(
						"id profile is not valid and must be 24 character & hexadecimal"
					);
				} else if (req.query.likeBy.toString() !== req.profile.id.toString()) {
					errors.push("id profile is not same");
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
