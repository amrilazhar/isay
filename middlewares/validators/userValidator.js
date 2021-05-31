const { body, param } = require("express-validator");
const mongoose = require("mongoose");

const admin = require("../../utils/firebase");
const User = require("../../models/users");

const isValidObjectId = async (value, { req }) => {
  const isValidObjectId = mongoose.isValidObjectId(value);
  if (!isValidObjectId) {
    return Promise.reject("User ID is not valid");
  }
  return true;
};

const objectId = (value) => {
  if (value) {
    return mongoose.Types.ObjectId(value);
  }
};

const userNotExistsById = async (value, { req }) => {
  const user = await User.exists({ _id: value });

  if (!user) {
    return Promise.reject("This User ID is not registered");
  }

  return true;
};

const userExistsByEmail = async (value, { req }) => {
  if (!value) {
    return true;
  }

  const email = await Promise.all([
    User.exists({ email: req.body.email }),
    User.exists({
      newEmail: req.body.email,
      emailExpiration: { $gt: Date.now() },
    }),
  ]);

  if (email[0] || email[1]) {
    return Promise.reject("This e-mail is already registered");
  }

  return true;
};

const userNotExistsByEmail = async (value, { req }) => {
  const email = await Promise.all([
    User.exists({ email: req.body.email }),
    User.exists({
      newEmail: req.body.email,
      emailExpiration: { $gt: Date.now() },
    }),
  ]);

  if (!email[0] || !email[1]) {
    return Promise.reject("This e-mail is not registered");
  }

  return true;
};

const comparePassword = async (value, { req }) => {
  if (req.body.password !== value) {
    return Promise.reject("Passwords must be same");
  }
  return true;
};

exports.signup = [
  body("email").isEmail().custom(userExistsByEmail).normalizeEmail(),
  body("password").trim().isLength({ min: 6 }),
  body("confirmPassword").custom(comparePassword),
];

exports.login = [
  body("email").isEmail(),
  body("password").trim().isLength({ min: 6 }),
];

exports.getSingleUser = [
  param("userId").custom(isValidObjectId).bail().customSanitizer(objectId),
];

exports.updateUser = [
  body("newEmail")
    .isEmail()
    .custom(userExistsByEmail)
    .bail()
    .normalizeEmail()
    .optional({ nullable: true }),
  body("password").trim().isLength({ min: 6 }).optional({ nullable: true }),
  body("confirmPassword").custom(comparePassword),
  body("firstName").trim().notEmpty().optional({ nullable: true }),
  body("lastName").trim().notEmpty().optional({ nullable: true }),
];

exports.resetPassword = [
  body("email").isEmail().normalizeEmail().custom(userNotExistsByEmail),
];

exports.changePassword = [
  body("password").trim().isLength({ min: 6 }),
  body("confirmPassword").custom(comparePassword),
  body("token").trim(),
];
