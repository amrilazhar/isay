const admin = require("../utils/firebase");

const User = require("../models/users");

const validationErrorHandler = require("../utils/validationErrorHandler");

const successMessage = "Fetched user successfully";

const userFields = ["email", "password", "photoURL", "firstName", "lastName"];
const firebaseUserFields = ["email", "password", "photoURL"];

// const actionCodeSettings = {
// 	url: "https://i-say-44322.firebaseapp.com",
// 	handleCodeInApp: true,
// 	iOS: {
// 		bundleId: "id.my.gabatch11.isay",
// 	},
// 	android: {
// 		packageName: "id.my.gabatch11.isay",
// 		installApp: true,
// 		minimumVersion: "12",
// 	},
// };

exports.signup = async (req, res, next) => {
	try {
		validationErrorHandler(req, res, next);

		// TODO GENERATE NAME

		const user = new User({
			// firstName: ,
			// lastName: ,
			email: req.body.email,
			// photoUrl: imageUrl,
		});

		await user.save();

		const firebaseUser = await admin.auth().createUser({
			uid: user._id.toString(),
			email: user.email,
			emailVerified: false,
			password: req.body.password,
			disabled: false,
			// photoURL: '',
		});

		const emailConfirmationLink = await admin
			.auth()
			.generateEmailVerificationLink(req.body.email);

		console.log(emailConfirmationLink);

		const token = await admin.auth().createCustomToken(firebaseUser.uid, {
			admin: user.admin,
		});

		res.status(201).json({
			success: true,
			message: "User created!",
			data: { id: firebaseUser.uid, token: token },
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getSingleUser = async (req, res, next) => {
	try {
		validationErrorHandler(req, res, next);

		const userId = req.params.userId;

		let pipeline = [
			{ $match: { _id: userId } },
			{
				$project: {
					_id: 0,
					id: "$_id",
					// firstName: "$firstName",
					// lastName: "$lastName",
					// photoUrl: "$photoUrl",
				},
			},
		];

		if (req.user?.uid === req.params.userId.toString()) {
			pipeline = [
				{ $match: { _id: userId } },
				{
					$project: {
						_id: 0,
						id: "$_id",
						email: "$email",
						// firstName: "$firstName",
						// lastName: "$lastName",
						// photoUrl: "$photoUrl",
					},
				},
			];
		}

		const [user] = await User.aggregate(pipeline);

		if (!user) {
			const error = new Error("User not found");
			error.statusCode = 404;
			throw error;
		}
		res.status(200).json({
			success: true,
			message: successMessage,
			data: user,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.updateUser = async (req, res, next) => {
	try {
		validationErrorHandler(req, res, next);

		let user = await User.findOne({ _id: req.user.uid });

		userFields.forEach((field) => {
			if (req.body[field]) {
				user[field] = req.body[field];
			}
		});

		const firebaseUser = {};

		firebaseUserFields.forEach((field) => {
			if (req.body[field]) {
				firebaseUser[field] = req.body[field];
			}
		});

		if (
			Object.entries(firebaseUser).length !== 0 &&
			firebaseUser.constructor === Object
		) {
			if (req.body?.email) {
				firebaseUser.emailVerified = false;
			}

			await admin.auth().updateUser(req.user.uid, firebaseUser);

			if (req.body?.email) {
				const emailConfirmationLink = await admin
					.auth()
					.generateEmailVerificationLink(req.body.email);

				// TODO CUSTOM E-MAIL
				console.log(emailConfirmationLink);
			}
		}

		await user.save();

		user = {
			id: user._id,
			email: user.email,
			// firstName: user.firstName,
			// lastName: user.lastName,
			// photoUrl: user.photoUrl
		};

		res.status(200).json({
			success: true,
			message: "User updated",
			data: user,
		});
	} catch (err) {
		console.log(err);
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.resetPassword = async (req, res, next) => {
	try {
		validationErrorHandler(req, res, next);

		const emailConfirmationLink = await admin
			.auth()
			.generatePasswordResetLink(req.body.email);

		// TODO CUSTOM E-MAIL
		console.log(emailConfirmationLink);

		res.status(200).json({
			success: true,
			message: "Password reset link has been sent!",
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
