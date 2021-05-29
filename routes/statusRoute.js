const express = require("express");
const router = express.Router();

// IMPORT CONTROLLER HERE
const statusController = require("../controllers/statusController");
const imageUpload = require("../middlewares/upload/images");
// IMPORT MIDDLEWARE HERE
const statusValidator = require("../middlewares/validators/statusValidator");
const imageDeletes = require("../middlewares/delete/image");
// IMPORT AUTH HERE
const tokenParser = require("../middlewares/authentication/tokenParser");
const isAuth = require("../middlewares/authentication/isAuth");
const setProfileId = require("../middlewares/user/setProfileId");

let dir = (req, res, next) => {
	req.directory = "images/status/";
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
//TODO : Endpoint Get Status By User (Loadmore)
router.get(
	"/users/loadmore/",
	tokenParser,
	isAuth,
	setProfileId,
	statusController.loadMoreStatusByUser
);
router.get(
	"/interest/",
	tokenParser,
	isAuth,
	setProfileId,
	statusController.getStatusByInterest
);
//TODO : Endpoint Get Status By Interest (All) (Loadmore)
router.get(
	"/interest/loadmore",
	tokenParser,
	isAuth,
	setProfileId,
	statusController.loadMoreStatusByInterest
);
router.get(
	"/interest/:id",
	tokenParser,
	isAuth,
	setProfileId,
	statusValidator.single,
	statusController.getSingleInterest
);
//TODO : Endpoint Get Status By Interest (Single) (Loadmore)
router.get(
	"/interest/:id/loadmore/",
	tokenParser,
	isAuth,
	setProfileId,
	statusValidator.single,
	statusController.loadMoreSingleInterest
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
//TODO : DELETE IMAGE
router.delete(
	"/delim/:id", 
	tokenParser, 
	isAuth, 
	setProfileId, 
	dir, 
	statusValidator.remove,
	statusController.imageDelete,
	imageDeletes
);
router.delete(
	"/:id",
	tokenParser,
	isAuth,
	setProfileId,
	statusValidator.delete,
	statusController.deleteStatus
);
router.get(
	"/:id",
	tokenParser,
	isAuth,
	setProfileId,
	statusValidator.single,
	statusController.getStatusByID
);

// EXPORTS MODULE HERE
module.exports = router;
