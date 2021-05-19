const validator = require("validator");
const mongoose = require("mongoose");

class CommentValidator {
	async commentValidate(req, res, next) {
		try {
			let act = req.route.path;
			let errors = [];

			if (act === "/") {
        
				if (req.data.owner !== req.profile.id) {
					errors.push(
						"id owner is not same"
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
