const express = require("express");
const router = express.Router();

// IMPORT HERE 
const commentController = require("../controllers/commentController");

//IMPORT MIDDLEWARE
const commentValidator = require("../middlewares/validators/commentValidator");


let authDummy = (req, res, next) => {
      req.profile = { id: "608c19b85a4b0b19ccced595" };
      
      next();
    };
    
// SET ROUTER COMMENT HERE
router.get("/getAllComment",authDummy,commentController.getAllComment);
router.post("/postComment/:id",authDummy, commentValidator.commentValidate,commentController.postComment);
router.post("/postComAftCom/:id",authDummy, commentValidator.commentValidate,commentController.postCommentAfterComment);
router.put("/:id",authDummy,commentValidator.commentIdValidate,commentController.updateComment);
router.delete("/:id",authDummy,commentController.deleteComment);
router.put("/addLike",authDummy,commentController.addLike);
router.put("/removeLike",authDummy,commentController.removeLike);

module.exports = router;