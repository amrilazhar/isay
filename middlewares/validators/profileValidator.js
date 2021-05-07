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


  async interestValidate(req, res, next) {
    try {
      let errors = []
      let act = req.route.path.substring(1)
      console.log(act,"<========================== ini req")

      if (act === "addInterest") {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          errors.push(
            "id profile is not valid and must be 24 character & hexadecimal"
          );
        }

        if (!mongoose.Types.ObjectId.isValid(req.interest._id)) {
          errors.push(
            "id interest is not valid and must be 24 character & hexadecimal"
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







      
      if (act === "deleteLocation" || act === "deleteInterest") {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          errors.push(
            "id profile is not valid and must be 24 character & hexadecimal"
          );
        }

        if (!mongoose.Types.ObjectId.isValid(req.body.location)) {
          errors.push(
            "id location is not valid and must be 24 character & hexadecimal"
          );
        }

        if (!mongoose.Types.ObjectId.isValid(req.body.interest)) {
          errors.push(
            "id interest is not valid and must be 24 character & hexadecimal"
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
}

module.exports = new ProfileValidator();
