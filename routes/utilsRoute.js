const express = require("express");
const router = express.Router();

// IMPORT HERE
const utilsController = require("../controllers/utilsController");

// SET ROUTER HERE
router.get("/location/", utilsController.getAllLocation);
router.get("/interest/:category", utilsController.getInterest);

const interestController = require("../controllers/interestController");
// SET ROUTER INTEREST HERE
router.get("/getInterest", interestController.getAllInterest);
router.post("/createInterest", interestController.createInterest);
router.put("/updateInterest/:id", interestController.updateInterest);
router.delete("/deleteInterest/:id", interestController.deleteInterest);

module.exports = router;
