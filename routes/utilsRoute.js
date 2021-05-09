const express = require("express");
const router = express.Router();

// IMPORT HERE
const utilsController = require("../controllers/utilsController");

// SET ROUTER HERE
router.get("/location/", utilsController.getAllLocation);
router.get("/interest/:category", utilsController.getInterest);
router.post("/genProfile", utilsController.generateBasicProfile);


module.exports = router;
