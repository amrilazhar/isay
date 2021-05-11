const express = require("express");
const router = express.Router();

// IMPORT HERE
const chatController = require("../controllers/chatController");
const {startSocketChat} = require("../middlewares/socket/chat");

const tokenParser = require("../middlewares/authentication/tokenParser");

//set variabel profile.id
let setProfileId = (req, res, next) => {
  req.profile = { id: req.user.profile };  
  next();
};

// SET ROUTER HERE
router.post("/joinRoom", tokenParser, setProfileId, chatController.joinRoom, startSocketChat);
router.get("/messageHistory/:chatRoom", tokenParser, setProfileId, chatController.getMessageHistory);

module.exports = router;
