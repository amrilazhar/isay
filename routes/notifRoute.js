const express = require("express");
const router = express.Router();
const notifController = require("../controllers/notificationController");
const tokenParser = require("../middlewares/authentication/tokenParser");
const isAuth = require("../middlewares/authentication/isAuth");
const setProfileId = require("../middlewares/user/setProfileId");

// SET ROUTER HERE
router.get(
	"/",
	tokenParser,
	isAuth,
	setProfileId,
	notifController.getNotifHistory
);

router.get(
	"/unreadNotif",
	tokenParser,
	isAuth,
	setProfileId,
	notifController.getUnreadedNotifCount
);

router.put(
	"/readNotif/:id",
	tokenParser,
	isAuth,
	setProfileId,
	notifController.setReadNotif
);

module.exports = router;
