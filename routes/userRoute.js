const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const tokenParser = require('../middlewares/authentication/tokenParser');
const isAuth = require('../middlewares/authentication/isAuth');
const isLoggedIn = require('../middlewares/authentication/isLoggedIn');

const userValidator = require('../middlewares/validators/userValidator');

/* POST signup.*/
router.post(
	'/signup',
	tokenParser,
	isLoggedIn,
	userValidator.signup,
	userController.signup
);

/* GET single user. */
router.get(
	'/:userId',
	tokenParser,
	userValidator.getSingleUser,
	userController.getSingleUser
);

/* PUT single user. */
router.put(
	'/',
	tokenParser,
	isAuth,
	userValidator.updateUser,
	userController.updateUser
);

/* PUT password reset. */
router.post(
	'/reset_password',
	userValidator.resetPassword,
	userController.resetPassword
);

module.exports = router;