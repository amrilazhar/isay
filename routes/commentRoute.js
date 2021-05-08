const express = require("express");
const router = express.Router();

// IMPORT HERE 
const commentController = require("../controllers/commentController");

//IMPORT MIDDLEWARE
const profileValidator = require("../middlewares/validators/commentValidator");

let authDummy = (req, res, next) => {
      req.profile = { id: "608c19b85a4b0b19ccced595" };
      
      next();
    };
// SET ROUTER COMMENT HERE
router.get("/getAllComment",commentController.getAllComment);
router.post("/postComment",authDummy,commentValidator.commentValidate, commentController.postComment);
router.put("/updateComment/:id",commentController.updateComment);
router.delete("/deleleteComment/:id",commentController.deleteComment);
router.put("/addLike",authDummy,commentController.addLike)


module.exports = router;
