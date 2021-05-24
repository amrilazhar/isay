const validator = require("validator");
const mongoose = require("mongoose");

class ProfileValidator {
  async profileValidate(req, res, next) {
    try {
      let errors = []
      let act = req.route.path

      if (act === "/:id") {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          errors.push(
            "id profile is not valid and must be 24 character & hexadecimal"
          );
        }
        if (req.body.name == null ) {
          req.body.name == req.body.name;
        }
        else if (!validator.isAlpha(validator.blacklist(req.body.name, " "))) {
          errors.push("Name must be alphabet");
        }
        if ( req.body.user == null) {
         req.body.user == req.body.user;
        }
        else if (!mongoose.Types.ObjectId.isValid(req.body.user)) {
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
    } catch (err) {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
};

module.exports = new ProfileValidator();
