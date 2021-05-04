const express = require("express");
const router = express.Router();

// IMPORT HERE 
const commentController = require("../controllers/commentController");

// SET ROUTER POST HERE
router.get("/getAllPost",commentController.getAllPost);
router.post("/postCreate",commentController.postCreate);
router.put("/updatePost/:id",commentController.updatePost);
router.delete("/deletePost/:id",commentController.deletePost);

// SET ROUTER COMMENT HERE
router.post("/postComment",commentController.postComment);
router.put("/updateComment/:id",commentController.updateComment);
router.delete("/deleleteComment/:id",commentController.deleteComment);
router.post("/postLike/:id",commentController.postLike)

module.exports = router;