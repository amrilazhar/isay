const validationErrorHandler = require("../utils/validationErrorHandler");

const {
	status,
	comment,
	profile,
	interest,
	activities,
	notification,
	location,
} = require("../models");

class StatusController {
	//TODO-POST : create status/post : Record (Activities)
	async createStatus(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let data = {
				content: req.body.content,
				owner: req.profile.id,
				interest: req.body.interest,
				media: [],
			};

			if ("images" in req) {
				data.media = req.images;
			}

			let statusCreate = await status.create(data);

			if (!statusCreate) {
				const error = new Error("Create status failed");
				error.statusCode = 400;
				throw error;
			} else {
				// Socket io
				req.io.emit("post:" + req.body.interest, statusCreate);

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

	//TODO-GET : Get status/post by User : Pagination
	async getStatusByUser(req, res, next) {
		try {
			validationErrorHandler(req, res, next);
			//pagination
			const options = {
				sort: { created_at: -1 },
				page: req.query.page
					? req.query.page < 20
						? req.query.page
						: 20
					: 1,
				limit: req.query.limit ? req.query.limit : 8,
				populate: [
					{ path: "owner", populate: "location" },
					{ path: "interest", select: "interest category" },
				],
			};

			let statusUsers = await status.paginate(
				//search key
				{ owner: req.profile.id },
				//pagination setting
				options
			);
			//restruktur data mongoose paginate
			let returnData = { ...statusUsers, data: statusUsers.docs };
			delete returnData.docs;

			if (!statusUsers) {
				const error = new Error("Status user can't be appeared");
				error.statusCode = 400;
				throw error;
			} else {
				res.status(200).json({
					success: true,
					message: "Success",
					...returnData,
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

	//TODO-GET : Get status/post by interest (all) : Pagination
	async getStatusByInterest(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let interestUser = await profile.findOne({ _id: req.profile.id });
			let stringFind = { $or: [] };

			interestUser.interest.forEach((item) => {
				stringFind["$or"].push({ interest: item });
			});
			//pagination
			const options = {
				sort: { created_at: -1 },
				page: req.query.page
					? req.query.page < 20
						? req.query.page
						: 20
					: 1,
				limit: req.query.limit ? req.query.limit : 8,
				populate: [
					{ path: "owner", populate: "location" },
					{ path: "interest", select: "interest category" },
				],
			};

			let statusData = await status.paginate(stringFind, options);

			//restruktur data mongoose paginate
			let returnData = { ...statusData, data: statusData.docs };
			delete returnData.docs;

			if (!statusData) {
				const error = new Error("Status data can't be appeared");
				error.statusCode = 400;
				throw error;
			} else {
				res.status(200).json({
					success: true,
					message: "Success",
					...returnData,
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

	//TODO-GET : Get status/post by interest (single) : Pagination
	async getSingleInterest(req, res, next) {
		try {
			validationErrorHandler(req, res, next);
			//pagination
			const options = {
				sort: { created_at: -1 },
				page: req.query.page
					? req.query.page < 20
						? req.query.page
						: 20
					: 1,
				limit: req.query.limit ? req.query.limit : 8,
				populate: [
					{ path: "owner", populate: "location" },
					{ path: "interest", select: "interest category" },
				],
			};

			let statusData = await status.paginate(
				//search key
				{ interest: { $in: [req.params.id] } },
				//pagination setting
				options
			);

			//restruktur data mongoose paginate
			let returnData = { ...statusData, data: statusData.docs };
			delete returnData.docs;

			if (!statusData) {
				const error = new Error("Status data can't be appeared");
				error.statusCode = 400;
				throw error;
			} else {
				res.status(200).json({
					success: true,
					message: "Success",
					...returnData,
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

	//TODO-PUT : Update status/post
	async updateStatus(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let data = {
				content: req.body.content,
				interest: req.body.interest,
			};

			let statusUpdate = await status.findOneAndUpdate(
				{
					_id: req.params.id,
				},
				data,
				{
					new: true,
				}
			);

			let oldImage = statusUpdate.media.map((item) =>
				item.replace(process.env.S3_URL, "")
			);

			statusUpdate.media = [...oldImage, ...req.images];
			await statusUpdate.save();

			if (!statusUpdate) {
				const error = new Error("Update status failed");
				error.statusCode = 400;
				throw error;
			} else {
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

	//TODO-PUT : Like Status/post : Record (Activities) : Record (Notification)
	async likeStatus(req, res, next) {
		try {
			let findStatusByUser = await status.findOne({ _id: req.params.id });

			if (!findStatusByUser) {
				const error = new Error("Status not found");
				error.statusCode = 400;
				throw error;
			}

			if (findStatusByUser.likeBy.includes(req.profile.id)) {
				const error = new Error("You can't like status twice");
				error.statusCode = 400;
				throw error;
			}

			findStatusByUser.likeBy.push(req.profile.id);

			await findStatusByUser.save();

			await activities.create({
				type: "like_status",
				status_id: findStatusByUser._id,
				owner: req.profile.id,
			});

			let notif = await notification.create({
				type: "like_status",
				status_id: findStatusByUser._id,
				from: req.profile.id,
				to: findStatusByUser.owner,
			});

			notif.populate("status_id from to").execPopulate();

			req.io.emit("notif:" + findStatusByUser.owner, notif);

			res.status(200).json({
				success: true,
				message: "Success",
				data: findStatusByUser,
			});
		} catch (err) {
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//TODO-PUT : Unlike Status/post
	async unlikeStatus(req, res, next) {
		try {
			let findStatusByUser = await status.findOne({ _id: req.params.id });

			if (!findStatusByUser) {
				const error = new Error("Status Not Found");
				error.statusCode = 400;
				throw error;
			}

			let indexOfLike = findStatusByUser.likeBy.indexOf(req.profile.id);
			console.log(indexOfLike);

			if (indexOfLike == -1) {
				console.log(indexOfLike);
				const error = new Error("Status not liked yet");
				error.statusCode = 400;
				throw error;
			}

			findStatusByUser.likeBy.splice(indexOfLike, 1);

			let deleteLike = await status.findOneAndUpdate(
				{ _id: findStatusByUser._id },
				findStatusByUser,
				{ new: true }
			);

			await activities.deleteOne({
				status_id: req.params.id,
				type: "like_status",
			});

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

	//TODO-DELETE : Delete status/post
	async deleteStatus(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let statusDelete = await status.deleteOne({ _id: req.params.id });

			if (!statusDelete) {
				const error = new Error("Delete status failed");
				error.statusCode = 400;
				throw error;
			} else {
				await activities.deleteOne({
					status_id: req.params.id,
					type: "post_status",
				});

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
}

module.exports = new StatusController();
