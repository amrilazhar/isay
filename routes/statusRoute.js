const express = require("express");
const router = express.Router();

// IMPORT CONTROLLER HERE
const statusController = require("../controllers/statusController");
const imageUpload = require("../middlewares/upload/images");
// IMPORT MIDDLEWARE HERE
const statusValidator = require("../middlewares/validators/statusValidator");

// IMPORT AUTH HERE
const tokenParser = require("../middlewares/authentication/tokenParser");
const isAuth = require("../middlewares/authentication/isAuth");

// SET VARIABLE PROFILE ID
let setProfileId = (req, res, next) => {
	req.profile = { id: req.user.profile };
	next();
};

let dir = (req, res, next) => {
	req.directory = "images/status";
	next();
};

// SET ROUTER HERE
router.post(
	"/",
	tokenParser,
	isAuth,
	setProfileId,
	dir,
	imageUpload,
	statusValidator.create,
	statusController.createStatus
);
router.get(
	"/users/",
	tokenParser,
	isAuth,
	setProfileId,
	statusController.getStatusByUser
);
router.get(
	"/interest/",
	tokenParser,
	isAuth,
	setProfileId,
	statusController.getStatusByInterest
);
router.get(
	"/interest/:id",
	tokenParser,
	isAuth,
	setProfileId,
	statusValidator.single,
	statusController.getSingleInterest
);
router.put(
	"/:id",
	tokenParser,
	isAuth,
	setProfileId,
	dir,
	imageUpload,
	statusValidator.update,
	statusController.updateStatus
);
router.put(
	"/like/:id",
	tokenParser,
	isAuth,
	setProfileId,
	statusController.likeStatus
);
router.put(
	"/unlike/:id",
	tokenParser,
	isAuth,
	setProfileId,
	statusController.unlikeStatus
);
router.delete(
	"/:id",
	tokenParser,
	isAuth,
	setProfileId,
	statusValidator.delete,
	statusController.deleteStatus
);

// EXPORTS MODULE HERE
module.exports = router;
