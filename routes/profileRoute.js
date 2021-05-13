const express = require("express");
const router = express.Router();

// IMPORT HERE
const profileController = require("../controllers/profileController");

//IMPORT MIDDLEWARE
const profileValidator = require("../middlewares/validators/profileValidator");

let authDummy = (req, res, next) => {
	req.profile = { id: "608ac628c8d0a1bfded19469" };

	next();
};

const tokenParser = require("../middlewares/authentication/tokenParser");
const isAuth = require("../middlewares/authentication/isAuth");

//set variabel profile.id
let setProfileId = (req, res, next) => {
  req.profile = { id: req.user.profile };  
  next();
};

// SET ROUTER PROFILE HERE
router.get("/getProfile/:id",authDummy, profileController.myProfile);
router.get("/Post",authDummy, profileController.myProfilePost);
router.get("/Activities", authDummy,profileController.myProfileActivities);
router.put("/:id",authDummy, profileValidator.profileValidate,profileController.profileUpdate);
router.put("/Interest/:id",authDummy, profileController.addInterest);
router.put("/Interest/:id",authDummy, profileController.deleteInterest);
router.get("/userInterest",tokenParser, isAuth, setProfileId, profileController.getListUserInterest )

module.exports = router;
