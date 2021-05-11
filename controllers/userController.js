const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const auth = {
	auth: {
		api_key: process.env.MAILGUN_API_KEY,
		domain: process.env.MAILGUN_DOMAIN,
	},
};

const nodemailerMailgun = nodemailer.createTransport(mg(auth));

const SENDER_ADDRESS = "noreply@isay.gabatch11.my.id";

const User = require("../models/users");

const validationErrorHandler = require("../utils/validationErrorHandler");

const successMessage = "Fetched user successfully";

const userFields = [
	"newEmail",
	"password",
	"photoURL",
	"firstName",
	"lastName",
];

const generateToken = () => {
	const token = crypto.randomBytes(32).toString("hex");
	return token;
};

exports.signup = async (req, res, next) => {
	try {
		validationErrorHandler(req, res, next);

		// TODO GENERATE NAME

		const user = new User({
			email: req.body.email,
			password: req.body.password,
			// firstName: ,
			// lastName: ,
			// photoUrl: imageUrl,
			emailToken: generateToken(),
			emailExpiration: Date.now() + 3600000,
		});

		await user.save();

		// TODO SEND E-MAIL
		console.log(user.emailToken);

		nodemailerMailgun.sendMail({
			from: SENDER_ADDRESS,
			to: user.email,
			subject: "Welcome to i-Say!",
			html: `<a href="${process.env.SERVER_URI}/user/verify?action=verifyEmail&token=${user.emailToken}">Click here to verify your e-mail!</a>`,
		});

		const token = jwt.sign(
			{
				id: user._id.toString(),
				admin: user.admin,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "30d" }
		);

		res.status(201).json({
			success: true,
			message: "User created!",
			data: { id: user._id, token: token },
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.login = async (req, res, next) => {
	try {
		validationErrorHandler(req, res, next);

		const password = req.body.password;

		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			const error = new Error("A user with this e-mail could not be found");
			error.statusCode = 401;
			throw error;
		}

		const isEqual = await user.comparePassword(password);

		if (!isEqual) {
			const error = new Error("Wrong password!");
			error.statusCode = 401;
			throw error;
		}

		const token = jwt.sign(
			{
				id: user._id.toString(),
				admin: user.admin,
				profile : user.profile,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "30d" }
		);

		res.status(200).json({
			success: true,
			message: "Login success",
			data: { token: token, id: user._id.toString() },
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.googleSignIn = async (req, res, next) => {
	try {
		const ticket = await client.verifyIdToken({
			idToken: req.body.token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		if (!ticket) {
			// TODO
		}

		const { email } = ticket.getPayload();

		console.log(ticket.getPayload());

		// TODO
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

		let noFieldUpdated = true;

		userFields.forEach((field) => {
			if (req.body[field]) {
				console.log(req.body[field]);
				noFieldUpdated = false;
				req.user[field] = req.body[field];
			}
		});

		if (noFieldUpdated) {
			const err = new Error("No field was updated");
			err.statusCode = 422;
			throw err;
		}

		if (req.body?.newEmail) {
			req.user.emailToken = generateToken();
			req.user.emailExpiration = Date.now() + 3600000;

			// TODO SEND E-MAIL
			console.log(req.user.emailToken);

			nodemailerMailgun.sendMail({
				from: SENDER_ADDRESS,
				to: req.user.newEmail,
				subject: "i-Say - E-mail Confirmation",
				html: `<a href="${process.env.SERVER_URI}/user/verify?action=verifyEmail&token=${req.user.emailToken}">Click here to verify your e-mail!</a>`,
			});
		}

		await req.user.save();

		const user = {
			id: req.user._id,
			newEmail: req.user.newEmail,
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

		const user = await User.findOne({ email: req.body.email });

		user.resetPasswordToken = generateToken();
		user.resetPasswordExpiration = Date.now() + 3600000;

		await user.save();

		// TODO CUSTOM E-MAIL
		console.log(user.resetPasswordToken);

		nodemailerMailgun.sendMail({
			from: SENDER_ADDRESS,
			to: user.email,
			subject: "i-Say - E-mail Confirmation",
			html: `<a href="${process.env.SERVER_URI}/verify?action=resetPassword&token=${user.resetPasswordToken}">Click here to reset your password!</a>`,
		});

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

exports.verify = async (req, res, next) => {
	let user;
	try {
		switch (req.query.action) {
			case "resetPassword":
				user = await User.findOne({
					resetPasswordToken: req.query.token,
					resetPasswordExpiration: { $gt: Date.now() },
				});

				if (!user) {
					const err = new Error("Invalid token or token has expired");
					err.statusCode = 404;
					throw err;
				}

				return res.status(200).json({
					success: true,
					message: "Token is valid",
					data: {
						token: user.resetPasswordToken,
					},
				});
			case "verifyEmail":
				user = await User.findOne({
					emailToken: req.query.token,
					emailExpiration: { $gt: Date.now() },
				});

				if (!user) {
					const err = new Error("Invalid token or token has expired");
					err.statusCode = 404;
					throw err;
				}

				user.emailToken = null;
				user.emailExpiration = null;
				user.emailVerified = true;

				if (user.newEmail) {
					user.email = user.newEmail;
					user.newEmail = null;
				}

				await user.save();

				console.log(user);

				return res.status(200).json({
					success: true,
					message: "E-mail has been verified",
					data: {
						email: user.email,
					},
				});
			default:
				const err = new Error("Invalid action");
				err.statusCode = 400;
				throw err;
		}
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.changePassword = async (req, res, next) => {
	try {
		const user = await User.findOne({
			resetPasswordToken: req.body.token,
			resetPasswordExpiration: { $gt: Date.now() },
		});

		if (!user) {
			const err = new Error("Invalid token or token has expired");
			err.statusCode = 404;
			throw err;
		}

		user.password = req.body.password;

		await user.save();

		return res.status(200).json({
			success: true,
			message: "Password has been changed",
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
