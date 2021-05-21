const { body, query, param } = require("express-validator");
const mongoose = require("mongoose");

const { status, comment, profile, interest } = require("../../models");

const isValidObjectId = async (value, { req }) => {
  console.log(value);
  const isValidObjectId = mongoose.isValidObjectId(value);
  if (!isValidObjectId) {
    return Promise.reject("Profile ID is not valid");
  }
  return true;
};

const isProfileExists = async (value, { req }) => {
  const isProfileExists = await profile.exists({ _id: value });
  if (!isProfileExists) {
    return Promise.reject("Profile ID doesn't exist");
  }
  return true;
};

const objectId = (value) => {
  if (value) {
    console.log("PROFILE", value);
    return mongoose.Types.ObjectId(value);
  }
};

exports.create = [
  body("content")
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage("Content must be 5 more character"),
  body("owner").trim().custom(isValidObjectId).bail().customSanitizer(objectId),
  body("media").trim(),
  body("comment")
    .trim()
    .custom(isValidObjectId)
    .bail()
    .customSanitizer(objectId),
  body("interest")
    .trim()
    .custom(isValidObjectId)
    .bail()
    .customSanitizer(objectId),
  body("likeBy")
    .trim()
    .custom(isValidObjectId)
    .bail()
    .customSanitizer(objectId),
];

exports.update = [
  param("id").trim().custom(isValidObjectId).bail().customSanitizer(objectId),
  body("content")
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage("Content must be 5 more character"),
  body("owner").trim().custom(isValidObjectId).bail().customSanitizer(objectId),
  body("media").trim(),
  body("comment")
    .trim()
    .custom(isValidObjectId)
    .bail()
    .customSanitizer(objectId),
  body("interest")
    .trim()
    .custom(isValidObjectId)
    .bail()
    .customSanitizer(objectId),
  body("likeBy")
    .trim()
    .custom(isValidObjectId)
    .bail()
    .customSanitizer(objectId),
];

exports.user = [
  param("id")
    .stripLow()
    .custom(isValidObjectId)
    .bail()
    .customSanitizer(objectId),
];

exports.interest = [
  param("id")
    .stripLow()
    .custom(isValidObjectId)
    .bail()
    .customSanitizer(objectId),
];

exports.single = [
  param("id")
    .stripLow()
    .custom(isValidObjectId)
    .bail()
    .customSanitizer(objectId),
];

exports.delete = [param("id").trim().custom(isValidObjectId)];

exports.searchAll = [query("query").stripLow().trim()];

exports.searchByUser = [
  param("id")
    .stripLow()
    .trim()
    .custom(isValidObjectId)
    .bail()
    .customSanitizer(objectId)
    .bail()
    .custom(isProfileExists),
  query("query").stripLow().trim(),
];
