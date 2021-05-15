const validator = require("validator");
const mongoose = require("mongoose");

class CommentValidator {
  async commentIdValidate(req, res, next) {
    try {
      
      let act = req.route.path
      let errors = [];
      
      if (act === "/:id") {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        errors.push("id comment is not valid and must be 24 character & hexadecimal");
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

  async commentValidate(req, res, next) {
    try {
      

      let act = req.route.path.substring(1).replace('/:id', '');
      let errors = [];
      if (act === "postComment" || act === "postComAftCom") {

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        errors.push("id status or id comment is not valid and must be 24 character & hexadecimal");
      }
    }
    if (errors.length > 0) {
      return res.status(400).json({
        message: errors
      });
    }
      // Go to next
      next()
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
