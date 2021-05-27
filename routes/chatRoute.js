const express = require("express");
const router = express.Router();

// IMPORT HERE
const chatController = require("../controllers/chatController");
// const { startSocketChat } = require("../middlewares/socket/chat");

const tokenParser = require("../middlewares/authentication/tokenParser");
const isAuth = require("../middlewares/authentication/isAuth");
const setProfileId = require("../middlewares/user/setProfileId");
const { getOnlineStatus } = require("../middlewares/user/onlineStatus");

// SET ROUTER HERE
router.post(
	"/joinRoom",
	tokenParser,
	isAuth,
	setProfileId,
  getOnlineStatus,
	chatController.joinRoom,
);
router.get(
	"/messageHistory/:chatRoom",
	tokenParser,
	isAuth,
	setProfileId,
  getOnlineStatus,
	chatController.getMessageHistory,
  // startSocketChat,
);
router.get(
	"/roomList",
	tokenParser,
	isAuth,
	setProfileId,
	chatController.getRoomList
);
router.get(
	"/loadMore",
	tokenParser,
	isAuth,
	setProfileId,
	chatController.loadOlderMessage
);

module.exports = router;
