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
router.post("/", authDummy, statusValidator.create, statusController.createStatus);
router.get("/users/", authDummy, statusValidator.user, statusController.getStatusByUser);
router.get("/interest/", authDummy, statusValidator.interest, statusController.getStatusByInterest);
router.get("/interest/:id", authDummy, statusValidator.single, statusController.getSingleInterest);
router.put("/:id", authDummy,statusValidator.update, statusController.updateStatus);
router.delete("/:id", authDummy,statusValidator.delete, statusController.deleteStatus);

module.exports = router;
