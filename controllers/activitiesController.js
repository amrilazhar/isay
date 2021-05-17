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
	async createActivity(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let activityCreate = await activities.create(req.activities);

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
	async getUserActivity(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let limit = req.query.limit ? req.query.limit : 10;
			let skip = req.query.skip ? req.query.skip : 0;

			let activityUser = await activities
				.find({ owner: req.profile.id })
				.sort({ updated_at: -1 })
				.populate("activities", "status_id comment_id")
				.limit(limit)
				.skip(skip)
				.exec();

			if (!activityUser) {
				const error = new Error("Activity user can't be appeared");
				error.statusCode = 400;
				throw error;
			} else {
				res.status(200).json({
					success: true,
					message: "Success",
					data: activityUser,
				});
			}
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
