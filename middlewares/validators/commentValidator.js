const validator = require("validator");
const mongoose = require("mongoose");
const { user, review, movie } = require("../../models");

class CommentValidator {
  async commentValidate(req, res, next) {
    try {
      let errors = [];

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        errors.push("id is not valid and must be 24 character & hexadecimal");
      }

      if (!mongoose.Types.ObjectId.isValid(req.profile.id)) {
        errors.push(
          "profile id is not valid and must be 24 character & hexadecimal"
        );
      }

      if (errors.length > 0) {
        return res.status(400).json({
          message: errors.join(", "),
        });
      }

      // Go to next
      next();
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  }
}

module.exports = new CommentValidator();
