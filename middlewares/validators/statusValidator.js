const { body, query, params } = require("express-validator");
const mongoose = require("mongoose");

const { status, comment, profile, interest } = require("../../models");

const isValidObjectId = async (value, { req }) => {
	const isValidObjectId = mongoose.isValidObjectId(value);
	if (!isValidObjectId) {
		return Promise.reject("Profile ID is not valid");
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
	body("owner")
		.trim()
		.custom(isValidObjectId)
		.bail()
		.customSanitizer(objectId),
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
		.bail().customSanitizer(objectId),	
];

exports.update = [
	params("id").trim().custom(isValidObjectId).bail().customSanitizer(objectId),
	body("content")
		.trim()
		.isLength({ min: 5, max: 1000 })
		.withMessage("Content must be 5 more character"),
	body("owner").trim().custom(isValidObjectId).bail().customSanitizer(objectId),
	body("media").trim(),
];

exports.delete = [
	params("id")
	.trim()
	.custom(isValidObjectId)];

exports.getByInterest = [];

exports.getByUser = [
	param("id")
		.stripLow()
		.custom(isValidObjectId)
		.bail()
		.customSanitizer(objectId),
];

exports.get = [];
