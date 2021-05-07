const validator = require("validator");
const mongoose = require("mongoose");
const { profile, activities, comment, status, location } = require("../../models");

class ProfileValidator {
  async profileValidate(req, res, next) {
    try {
      let errors = []
      let act = req.route.path.substring(1).replace('/:id', '');

      if (act === "updateProfile") {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          errors.push(
            "id profile is not valid and must be 24 character & hexadecimal"
          );
        }

        if (!validator.isAlpha(validator.blacklist(req.body.name, " "))) {
          errors.push("Name harus must be alphabet");
        }

        if (!mongoose.Types.ObjectId.isValid(req.body._id)) {
          errors.push(
            "id user is not valid and must be 24 character & hexadecimal"
          );
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          message: errors.join(", "),
        });
      }

      next();
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  }

module.exports = new ProfileValidator();
