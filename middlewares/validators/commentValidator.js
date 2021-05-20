const validator = require("validator");
const mongoose = require("mongoose");

class CommentValidator {
	async commentValidate(req, res, next) {
		try {
			console.log();
			let act = req.route.path;
			let errors = [];

			if (act === "/") {
				if (req.body.owner.toString() !== req.profile.id.toString()) {
					errors.push("id owner is not same");
				};
				if (!mongoose.Types.ObjectId.isValid(req.body.status_id)) {
					errors.push(
						"id status is not valid and must be 24 character & hexadecimal"
					);
				};
			};

			
			if (errors.length == 1) {
				return res.status(400).json({
					message: errors,
				});
			}; 
			if (errors.length > 1) {
				return res.status(400).json({
					message: errors.join(",and "),
				});
			};
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
