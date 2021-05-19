const validationErrorHandler = require("../utils/validationErrorHandler");

const { status, comment, profile, interest, activities } = require("../models");

class StatusController {
	//TODO : create status/post
	async createStatus(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let data = {
				content: req.body.content,
				owner: req.profile.id,
				// media: req.body.media ? req.body.media : "images.jpg",
				media: [],
				comment: req.body.comment,
				interest: req.body.interest,
				// likeBy: req.body.likeBy,
			};

			if ("images" in req) {
				data.media = req.images;
			}

			let statusCreate = await status.create(data);

			if (!statusCreate) {
				const error = new Error("Create Status failed");
				error.statusCode = 400;
				throw error;
			} else {
				// Socket io
				req.io.emit("create status:" + statusCreate, statusCreate);

				await activities.create({
					type: "post_status",
					status_id: statusCreate._id,
					owner: req.profile.id,
				});

				res.status(201).json({
					success: true,
					message: "Success",
					data: statusCreate,
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

	//TODO : Update status/post
	async updateStatus(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let data = {
				content: req.body.content,
				owner: req.body.profile,
				// media: req.body.media ? req.body.media : "images.jpg",
				comment: req.body.comment,
				interest: req.body.interest,
				// likeBy: req.body.likeBy,
			};

			if ("images" in req) {
				data.media = req.images;
			}

			let statusUpdate = await status.findOneAndUpdate(
				{
					_id: req.params.id,
				},
				data,
				{
					new: true,
				}
			);
			if (!statusUpdate) {
				const error = new Error("Status data can't be appeared");
				error.statusCode = 400;
				throw error;
			} else {
				// Socket io
				req.io.emit("update status:" + statusUpdate, statusUpdate);

				res.status(200).json({
					success: true,
					message: "Success",
					data: statusUpdate,
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

	//TODO : Get status/post by User
	async getStatusByUser(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let statusUsers = await status
				.find({ owner: req.profile.id })
				.sort({ updated_at: -1 })
				.populate("interest");

			if (!statusUsers) {
				const error = new Error("Status user can't be appeared");
				error.statusCode = 400;
				throw error;
			} else {
				// Socket io
				req.io.emit("show all user status:" + statusUsers, statusUsers);

				res.status(200).json({
					success: true,
					message: "Success",
					data: statusUsers,
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

	//TODO : Get status/post by interest (all)
	async getStatusByInterest(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let limit = req.query.limit ? req.query.limit : 10;
			let skip = req.query.skip ? req.query.skip : 0;
			let interestUser = await profile.findOne({ _id: req.profile.id });
			let stringFind = { $or: [] };

			interestUser.interest.forEach((item) => {
				stringFind["$or"].push({ interest: item });
			});

			let statusData = await status
				.find(stringFind)
				.sort({ updated_at: -1 })
				.populate("interest")
				.populate("owner", "name avatar id location")
				.limit(limit)
				.skip(skip)
				.exec();

			if (statusData.length > 0) {
				res.status(200).send({
					success: true,
					message: "success",
					data: statusData,
				});
			} else {
				// Socket io
				req.io.emit("show all interest status:" + statusData, statusData);

				res.status(200).json({
					success: true,
					message: "success",
					data: [],
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

	//TODO : Get status/post by interest (single)
	async getSingleInterest(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let statusData = await status.find({ interest: { $in: [req.params.id] } });

			if (!statusData) {
				const error = new Error("Status data can't be appeared");
				error.statusCode = 400;
				throw error;
			} else {
				// Socket io
				req.io.emit("show single interest status:" + statusData, statusData);

				res.status(200).json({
					success: true,
					message: "Success",
					data: statusData,
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

	//TODO : Delete status/post
	async deleteStatus(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let statusDelete = await status.deleteOne({ _id: req.params.id });

			if (!statusDelete) {
				const error = new Error("Delete status failed");
				error.statusCode = 400;
				throw error;
			} else {
				// Socket io
				req.io.emit("delete status:" + statusDelete, statusDelete);

				res.status(200).json({
					success: true,
					message: "Success",
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

	//TODO : Like Status
	async likeStatus(req, res, next) {
		try {
			let findUser = await status.findOne({ _id: req.query.status_id });
			findUser.likeBy.push(req.profile.id);
			let insertUser = findUser.save();
			if (!insertUser) {
				const error = new Error("Can't like");
				error.statusCode = 400;
				throw error;
			} else
				res.status(200).json({
					success: true,
					message: "Success",
					data: findUser,
				});
		} catch (err) {
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//TODO : Unlike Status
	async unlikeStatus(req, res, next) {
		try {
			let findUser = await status.findOne({ _id: req.query.status_id });
			let indexOfLike = findUser.likeBy.indexOf(req.profile.id);
			findUser.likeBy.splice(indexOfLike, 1);
			let deleteLike = await status.findOneAndUpdate(
				{ _id: findUser._id },
				findUser,
				{ new: true }
			);
			if (!insertUser) {
				const error = new Error("Data User can't be appeared");
				error.statusCode = 400;
				throw error;
			} else
				res.status(200).json({
					success: true,
					message: "Success",
					data: deleteLike,
				});
			next();
		} catch (err) {
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
}

module.exports = new StatusController();
