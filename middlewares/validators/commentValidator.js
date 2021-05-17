const validator = require("validator");
const mongoose = require("mongoose");

class CommentValidator {
	async commentValidate(req, res, next) {
		try {
			let act = req.route.path;
			let errors = [];

			if (act === "/") {
        
				if (!mongoose.Types.ObjectId.isValid(req.body.status_id)) {
					errors.push(
						"id status is not valid and must be 24 character & hexadecimal"
					);
				}
      }

			if ((errors.length > 0)) {
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
