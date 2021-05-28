const validator = require("validator");
const mongoose = require("mongoose");

class CommentValidator {
  async commentValidate(req, res, next) {
    try {
      let errors = [];
      let act = req.route.path;
      

      if (act === "/") {
        if (!mongoose.Types.ObjectId.isValid(req.body.status_id)) {
          errors.push("Status id not valid");
        }
      }

      if (errors.length > 0 ) {
        return res.status(400).json({
          message: errors.toString(),
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
          message: errors.toString(),
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
          errors.push("Profile id is not found");
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          message: errors.toString(),
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

  async ImageDelValidate(req, res, next) {
    try {
      let act = req.route.path;
      let errors = [];

      if (act === "/delim/:id") {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          console.log("comment is not found");
        }
        if (!req.query.media.toString().includes(req.profile.id.toString())) {
          errors.push("delete can't be processes");
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          message: errors,
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
}
module.exports = new CommentValidator();
