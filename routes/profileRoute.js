const express = require("express");
const router = express.Router();

// IMPORT HERE
const profileController = require("../controllers/profileController");

//IMPORT MIDDLEWARE
const profileValidator = require("../middlewares/validators/profileValidator");
const tokenParser = require("../middlewares/authentication/tokenParser");
const isAuth = require("../middlewares/authentication/isAuth");
const setProfileId = require("../middlewares/user/setProfileId");
// SET ROUTER PROFILE HERE

//view our profile
router.get("/getProfile", tokenParser, isAuth, setProfileId, profileController.myProfile);
router.get("/Post", tokenParser, isAuth, setProfileId, profileController.myProfilePost);
router.get("/Activities", tokenParser, isAuth, setProfileId, profileController.myProfileActivities);

//view another profile
router.get("/an/:id", tokenParser, isAuth, setProfileId, profileController.anotherProfile);
router.get("/an/Post/:id", tokenParser, isAuth, setProfileId, profileController.anotherProfilePost);
router.get("/an/Activities/:id", tokenParser, isAuth, setProfileId, profileController.anotherProfileActivities);

//avatar
router.put("/changeAvatar/:avatar",tokenParser, isAuth, setProfileId, profileController.changeAvatar);
router.get("/avatarList",tokenParser, isAuth, setProfileId, profileController.getAvatarList);

//edit our profile
router.put("/Interest/:id", tokenParser, isAuth, setProfileId, profileController.addInterest);
router.put("/DeleteInt/:id", tokenParser, isAuth, setProfileId, profileController.deleteInterest);
router.get("/userInterest",tokenParser, isAuth, setProfileId, profileController.getListUserInterest);
router.put("/", tokenParser, isAuth, setProfileId, profileValidator.profileValidate,profileController.profileUpdate);



module.exports = router;
