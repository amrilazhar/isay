const express = require("express");
const router = express.Router();

// IMPORT AUTH HERE
let authDummy = (req, res, next) => {
	req.profile = { id: "608ac628c8d0a1bfded19469" };
	next();
};

// IMPORT MIDDLEWARE HERE

// IMPORT CONTROLLER HERE
const statusController = require("../controllers/statusController");

// SET ROUTER HERE
router.post("/create/", authDummy, statusController.createStatus);
router.get("/users/", authDummy, statusController.getStatusByUser);
router.get("/interest/", authDummy, statusController.getStatusByInterest);
router.put("/update/:id", statusController.updateStatus);
router.delete("/delete/:id", statusController.deleteStatus);

module.exports = router;
