const express = require("express");
const router = express.Router();

// IMPORT HERE
const chatController = require("../controllers/chatController");
const {startSocketChat} = require("../middlewares/socket/chat");

const tokenParser = require("../middlewares/authentication/tokenParser");
const isAuth = require("../middlewares/authentication/isAuth");

//set variabel profile.id
let setProfileId = (req, res, next) => {
  req.profile = { id: req.user.profile };  
  next();
};

// SET ROUTER HERE
router.post("/joinRoom", tokenParser, isAuth, setProfileId, chatController.joinRoom, startSocketChat);
router.get("/messageHistory/:chatRoom", tokenParser, isAuth, setProfileId, chatController.getMessageHistory);
router.get("/roomList",tokenParser, isAuth, setProfileId, chatController.getRoomList )

module.exports = router;
