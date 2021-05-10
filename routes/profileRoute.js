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

// SET ROUTER PROFILE HERE
router.get("/getProfile/:id",authDummy, profileController.myProfile);
router.get("/Post",authDummy, profileController.myProfilePost);
router.get("/Activities", authDummy,profileController.myProfileActivities);
router.put("/:id",authDummy, profileValidator.profileValidate,profileController.profileUpdate);
router.put("/Interest/:id",authDummy, profileController.addInterest);
router.put("/Interest/:id",authDummy, profileController.deleteInterest);

module.exports = router;
