const express = require("express");
const router = express.Router();

// IMPORT HERE
const commentController = require("../controllers/commentController");
const imageUpload = require("../middlewares/upload/images");
const imageDeletes = require("../middlewares/delete/image");

//IMPORT MIDDLEWARE
const commentValidator = require("../middlewares/validators/commentValidator");
const tokenParser = require("../middlewares/authentication/tokenParser");
const isAuth = require("../middlewares/authentication/isAuth");
const setProfileId = require("../middlewares/user/setProfileId");

let dir = (req, res, next) => {
  req.directory = "images/comment/";
  next();
};

// SET ROUTER COMMENT HERE
router.get(
  "/",
  tokenParser,
  isAuth,
  setProfileId,
  commentController.getAllComment
);
router.get(
  "/:id",
  tokenParser,
  isAuth,
  setProfileId,
  commentController.getOneComment
);
router.post(
  "/",
  tokenParser,
  isAuth,
  setProfileId,
  dir,
  imageUpload,
  commentValidator.commentValidate,
  commentController.postComment
);
router.put(
  "/:id",
  tokenParser,
  isAuth,
  setProfileId,
  dir,
  imageUpload,
  commentValidator.updateValidate,
  commentController.updateComment
);

//DELETE IMAGE
router.delete(
  "/delim/:id",
  tokenParser,
  isAuth,
  setProfileId,
  dir,
  commentValidator.ImageDelValidate,
  commentController.imageDelete,
  imageDeletes
);

router.delete(
  "/:id",
  tokenParser,
  isAuth,
  setProfileId,
  commentController.deleteComment
);
router.put(
  "/addLike/:id",
  tokenParser,
  isAuth,
  setProfileId,
  commentValidator.likeValidate,
  commentController.addLike
);
router.put(
  "/removeLike/:id",
  tokenParser,
  isAuth,
  setProfileId,
  commentValidator.likeValidate,
  commentController.removeLike
);

module.exports = router;
