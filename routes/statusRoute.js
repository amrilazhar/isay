const express = require("express");
const router = express.Router();

// IMPORT AUTH HERE
let authDummy = (req, res, next) => {
	req.profile = { id: "608ac628c8d0a1bfded19469" };
	next();
};

// IMPORT MIDDLEWARE HERE
const statusValidator = require("../middlewares/validators/statusValidator");

// IMPORT CONTROLLER HERE
const statusController = require("../controllers/statusController");

// SET ROUTER HERE
router.post("/create/", authDummy, statusValidator.create, statusController.createStatus);
router.get("/users/", authDummy, statusValidator.user, statusController.getStatusByUser);
router.get("/interest/", authDummy, statusValidator.interest, statusController.getStatusByInterest);
router.put("/update/:id", statusValidator.update, statusController.updateStatus);
router.delete("/delete/:id", statusValidator.delete, statusController.deleteStatus);

module.exports = router;
