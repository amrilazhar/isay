const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");
const tokenParser = require("../middlewares/authentication/tokenParser");
const isAuth = require("../middlewares/authentication/isAuth");
const isLoggedIn = require("../middlewares/authentication/isLoggedIn");
const utilsController = require("../controllers/utilsController");

const userValidator = require("../middlewares/validators/userValidator");

/* POST signup.*/
router.post(
	"/signup",
	tokenParser,
	isLoggedIn,
	userValidator.signup,
	userController.signup
);

/* POST login.*/
router.post(
	"/login",
	tokenParser,
	isLoggedIn,
	userValidator.login,
	userController.login
);

/* PUT password reset. */
router.post(
	"/reset_password",
	userValidator.resetPassword,
	userController.resetPassword
);

/* PUT change password. */
router.post(
	"/change_password",
	userValidator.changePassword,
	userController.changePassword
);

router.post(
	"/signup-google",
	userController.signupGoogle
);

router.post(
	"/login-google",
	userController.loginGoogle
);

/* GET verify actions. */
router.get("/verify", userController.verify);

/* GET single user. */
router.get(
	"/:userId",
	tokenParser,
	userValidator.getSingleUser,
	userController.getSingleUser
);

/* GET status profile Created or Not. */
router.get(
	"/status_profile/:userId",
	tokenParser,
	isAuth,
	userController.statusProfile
);

/* PUT single user. */
router.put(
	"/",
	tokenParser,
	isAuth,
	userValidator.updateUser,
	userController.updateUser
);

/* POST create first Profile.*/
router.post(
	"/first_profile",
	tokenParser,
	isAuth,
	utilsController.generateBasicProfile,
	userController.createFirstProfile
);

module.exports = router;