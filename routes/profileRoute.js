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

// SET ROUTER LOCATION HERE
router.get("/getLocation", locationController.getAllLocation);
router.post("/createLocation", locationController.createLocation);
router.put("/updateLocation/:id", locationController.updateLocation);
router.delete("/deleteLocation/:id", locationController.deleteLocation);

// SET ROUTER PROFILE HERE
router.get("/getProfile/:id", profileController.myProfile);
router.get("/getActProfile", profileController.myProfilePost);
router.get("/getPostProfile", profileController.myProfileActivities);
router.put(
  "/updateProfile/:id",
  profileValidator.profileValidate,
  profileController.profileUpdate
);
router.put("/AddInterest/:id", profileController.addInterest);
router.put("/AddLocation/:id", profileController.addLocation);
router.delete("/delInterest/:id", profileController.deleteInterest);
router.delete("/delLocation/:id", profileController.deleteLocation);
router.get("/getListUserInterest", authDummy, profileController.getListUserInterest);

module.exports = router;