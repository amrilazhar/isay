const express = require("express");
const router = express.Router();

// IMPORT AUTH HERE

// IMPORT MIDDLEWARE HERE

// IMPORT CONTROLLER HERE
const statusController = require("../controllers/statusController");

// SET ROUTER HERE
router.post("/create/", statusController.createStatus);
router.get("/", statusController.getStatusAll);
router.get("/users/", statusController.getStatusByUser);
router.get("/interest/", statusController.getStatusByInterest);
router.put("/update/", statusController.updateStatus);
router.delete("/delete/", statusController.deleteStatus);

module.exports = router;
