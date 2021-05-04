const { body, query, params } = require("express-validator");
const mongoose = require("mongoose");

const Status = require("../../models/status");
const Profile = require("../../models/profile");
const Comment = require("../../models/comment");

const isValidObjectId = async (value, { req }) => {
	const isValidObjectId = mongoose.isValidObjectId(value);
	if (!isValidObjectId) {
		return Promise.reject("Profile ID is not valid");
	}
	return true;
};

exports.create = [
	body("content")
		.trim()
		.isLength({ min: 5, max: 1000 })
		.withMessage("Post must be 5 more character"),
	body("owner").trim().custom(isValidObjectId),
	body("media").trim(),
];

exports.update = [
	params("id").trim().custom(isValidObjectId),
	body("content")
		.trim()
		.isLength({ min: 5, max: 1000 })
		.withMessage("Post must be 5 more character"),
	body("owner").trim().custom(isValidObjectId),
	body("media").trim(),
];

exports.delete = [params("id").trim().custom(isValidObjectId)];

exports.getByInterest = [];

exports.getByUser = [];

exports.get = [];
