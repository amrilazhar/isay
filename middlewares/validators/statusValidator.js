const { body, query, param } = require("express-validator");
const mongoose = require("mongoose");

const { profile } = require("../../models");

const isValidObjectId = async (value, { req }) => {
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
    return mongoose.Types.ObjectId(value);
  }
};

exports.create = [
	body("content")
		.trim()
		.isLength({ min: 5, max: 1000 })
		.withMessage("Content must be 5 more character"),
	body("media").trim(),
	body("interest")
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
	body("media").trim(),
	body("interest")
		.trim()
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

exports.remove = [
	param("id")
		.trim()
		.custom(isValidObjectId)
		.bail()
		.customSanitizer(objectId), 
	query("media")
		.trim()
];

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
