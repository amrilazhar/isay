const validationErrorHandler = require("../utils/validationErrorHandler");

const {
	profile,
	comment,
	activities,
	location,
	status,
	interest,
} = require("../models");

class ActivitiesController {
	// TODO : Create Activities (Post/Like)
	async createStatus(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let data = {
				//? Comment, Like, Post status
				activities_type: req.body.activities_type,
				status_id: req.status.id,
				comment_id: req.comment.id,
				owner: req.profile.id,
			};

			let activityCreate = await activities.create(data);

			if (!activityCreate) {
				const error = new Error("Create activities failed");
				error.statusCode = 400;
				throw error;
			}

			res.status(201).json({
				success: true,
				message: "Success",
				data: activity,
			});
		} catch (err) {
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	// TODO : Create Activities (Comment/Like)
	async createComment(req, res, next) {
		try {
			validationErrorHandler(req, res, next);
		} catch (err) {
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	// TODO : Create Activities
	async create(req, res, next) {
		try {
			validationErrorHandler(req, res, next);
		} catch (err) {
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	// TODO : Create Activities
	async create(req, res, next) {
		try {
			validationErrorHandler(req, res, next);
		} catch (err) {
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
}

module.exports = new ActivitiesController();
