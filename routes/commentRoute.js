const express = require("express");
const router = express.Router();

// IMPORT HERE 
const commentController = require("../controllers/commentController");


let authDummy = (req, res, next) => {
      req.profile = { id: "608c19b85a4b0b19ccced595" };
      
      next();
    };
// SET ROUTER COMMENT HERE
router.get("/getAllComment/:id",commentController.getAllComment);
router.post("/postComment/:id",authDummy,commentController.postComment);
router.put("/updateComment/:id",commentController.updateComment);
router.delete("/deleleteComment/:id",commentController.deleteComment);
router.put("/addLike",authDummy,commentController.addLike)


module.exports = router;