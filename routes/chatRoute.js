const express = require("express");
const router = express.Router();

// IMPORT HERE
const chatController = require("../controllers/chatController");

let authDummy = (req, req, next)=>{
    let id = ['608ac628c8d0a1bfded19469','608ac638c8d0a1bfded1946a'];
    req.user.id = id[Math.floor(Math.random()*2)];
    next();
};

// SET ROUTER HERE
router.post("/send", authDummy, chatController.send);
router.post("/createRoom", authDummy, chatController.createRoom);
router.get("/chatUser", authDummy, chatController.getUserList);

module.exports = router;
