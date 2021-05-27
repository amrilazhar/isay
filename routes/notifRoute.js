const express = require("express");
const router = express.Router();
const notifController = require("../controllers/notificationController");
const tokenParser = require("../middlewares/authentication/tokenParser");
const isAuth = require("../middlewares/authentication/isAuth");
const setProfileId = require("../utils/setProfileId");

// SET ROUTER HERE
router.get(
	"/",
	tokenParser,
	isAuth,
	setProfileId,
	notifController.getNotifHistory
);

module.exports = router;
