const express = require("express");
const router = express.Router();

// IMPORT AUTH HERE
let authDummy = (req, res, next) => {
	req.profile = { id: "6092c10dfc13ae1d130000c8" };
	next();
};

// IMPORT MIDDLEWARE HERE

// IMPORT CONTROLLER HERE
const statusController = require("../controllers/statusController");

// SET ROUTER HERE
router.post("/create/", authDummy, statusController.createStatus);
router.get("/", statusController.getStatusAll);
router.get("/users/", statusController.getStatusByUser);
router.get("/interest/", statusController.getStatusByInterest);
router.put("/update/:id", statusController.updateStatus);
router.delete("/delete/:id", statusController.deleteStatus);

module.exports = router;
