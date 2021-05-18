const express = require("express");
const router = express.Router();

// IMPORT HERE 
const commentController = require("../controllers/commentController");
const imageUpload = require("../middlewares/upload/images");

//IMPORT MIDDLEWARE
const commentValidator = require("../middlewares/validators/commentValidator");
const tokenParser = require("../middlewares/authentication/tokenParser");
const isAuth = require("../middlewares/authentication/isAuth");


//set variabel profile.id
let setProfileId = (req, res, next) => {
  req.profile = { id: req.user.profile };  
  next();
};

let dir = (req,res,next) => {
  req.directory = "images/comment/";
  next();
}
    
// SET ROUTER COMMENT HERE
router.get("/", tokenParser, isAuth, setProfileId,commentController.getAllComment);
router.post("/", tokenParser, isAuth, setProfileId, dir, imageUpload, commentValidator.commentValidate, commentController.postComment);
router.put("/:id", tokenParser, isAuth,  setProfileId, dir, imageUpload, commentController.updateComment);
router.delete("/:id", tokenParser, isAuth, setProfileId,commentController.deleteComment);
router.put("/addLike", tokenParser, isAuth, setProfileId,commentController.addLike);
router.put("/removeLike", tokenParser, isAuth, setProfileId,commentController.removeLike);

module.exports = router;