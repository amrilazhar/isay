const express = require("express");
const router = express.Router();

// IMPORT HERE 
const interestController = require("../controllers/interestController");
const profileController = require("../controllers/profileController");
const locationController = require("../controllers/locationController");



// SET ROUTER INTEREST HERE
router.get("/getInterest", interestController.getAllInterest);
router.post("/createInterest", interestController.createInterest);
router.put("/updateInterest/:id", interestController.updateInterest);
router.delete("/deleteInterest/:id", interestController.deleteInterest);

// SET ROUTER LOCATION HERE
router.get("/getLocation", locationController.getAllLocation);
router.post("/createLocation", locationController.createLocation);
router.put("/updateLocation/:id", locationController.updateLocation);
router.delete("/deleteLocation/:id", locationController.deleteLocation);

// SET ROUTER PROFILE HERE
router.get("/getProfile/:id",profileController.myProfile);
router.put("/updateProfile/:id",profileController.profileUpdate);
router.delete("/delInterestProfile/:id",profileController.deleteInterest);

module.exports = router;