const validator = require("validator");
const mongoose = require("mongoose");
const { profile, review, movie, comment, status } = require("../../models");

class CommentValidator {
  async commentValidate(req, res, next) {
    try {
      let errors = [];

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        errors.push("id is not valid and must be 24 character & hexadecimal");
      }

      if (!mongoose.Types.ObjectId.isValid(req.query.id_comment)) {
        errors.push(
          "comment is not found"
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
