const validationErrorHandler = require("../utils/validationErrorHandler");

const {
	status,
	profile,
	activities,
	notification,
} = require("../models");
const pushNotif = require("../utils/pushNotification");

const matchWords = (words) => {
	for (let i = 0; i < words.length; i++) {
		words[i] = `(?=.*${words[i]}\\b)`;
	}

	const regex = new RegExp(words.join(""));

	return regex;
};

const matchWordsForHtml = (words) => {
	const regex = new RegExp("(" + words.join("|") + ")", "gi");
	return regex;
};

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
				page: req.query.page ? (req.query.page < 20 ? req.query.page : 20) : 1,
				limit: req.query.limit ? req.query.limit : 8,
				populate: [
					{
						path: "owner",
						select: "id name avatar",
						populate: "location",
					},
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
			let stringFind = interestUser ? { $or: [] } : {};

			interestUser.interest.forEach((item) => {
				stringFind["$or"].push({ interest: item });
			});

			//pagination
			const options = {
				sort: { created_at: -1 },
				page: req.query.page ? (req.query.page < 20 ? req.query.page : 20) : 1,
				limit: req.query.limit ? req.query.limit : 8,
				populate: [
					{
						path: "owner",
						select: "id name avatar",
						populate: "location",
					},
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
				page: req.query.page ? (req.query.page < 20 ? req.query.page : 20) : 1,
				limit: req.query.limit ? req.query.limit : 8,
				populate: [
					{
						path: "owner",
						select: "id name avatar",
						populate: "location",
					},
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

			if (req.images) {
				let oldImageContainer = statusUpdate.media.map((item) =>
					item.replace(process.env.S3_URL, "")
				);
				statusUpdate.media = [...oldImageContainer, ...req.images];
				await statusUpdate.save();
			}

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

			await notif.populate("status_id from to").execPopulate();

			req.io.to(findStatusByUser.owner.toString()).emit("notif:" + findStatusByUser.owner, notif);
			//push notification
			let notifMessage = {
				notification : {
					title : `${notif.from.name} like your status`,
					body : `Feed : ${notif.status_id.content.substring(0, 50)}`,
				},
				topic : "notif-" + findStatusByUser.owner
			}
			pushNotif(notifMessage);

			res.status(200).json({
				success: true,
				message: "Success",
				data: findStatusByUser,
			});
		} catch (err) {
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

			if (indexOfLike == -1) {
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
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//TODO-DELETE : Delete Image
	async imageDelete(req, res, next) {
		try {
			let findStatus = await status.findOne({ _id: req.params.id });
			let indexOfImages = findStatus.media.indexOf(req.query.media);
			findStatus.media.splice(indexOfImages, 1);

			let deleteImage = await status.findOneAndUpdate(
				{ _id: findStatus._id },
				findStatus,
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: "Success",
				data: deleteImage,
			});

			next();
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//TODO-GET : Loadmore Get Status/Post By User
	async loadMoreStatusByUser(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let limit = eval(req.query.limit) ? eval(req.query.limit) : 8;
			let statusUsers = await status
				.find({ owner: req.profile.id })
				.sort({ created_at: -1 })
				.populate({
					path: "owner",
					select: "id name avatar",
					populate: "location",
				})
				.populate({ path: "interest", select: "interest category" })
				.limit(limit + 1)
				.exec();

			let lastLoad = false;
			if (statusUsers.length < limit) {
				lastLoad = true;
			} else statusUsers.splice(limit, 1);

			if (statusUsers.length > 0) {
				res.status(200).send({
					success: true,
					message: "success",
					data: statusUsers.reverse(),
					last: lastLoad,
				});
			} else {
				res.status(200).json({
					success: true,
					message: "success",
					data: [],
					last: lastLoad,
				});
			}
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//TODO-GET : Loadmore Get Status/Post By Interest (all)
	async loadMoreStatusByInterest(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let limit = eval(req.query.limit) ? eval(req.query.limit) : 8;

			let interestUser = await profile.findOne({ _id: req.profile.id });
			let stringFind = interestUser ? { $or: [] } : {};

			interestUser.interest.forEach((item) => {
				stringFind["$or"].push({ interest: item });
			});

			let statusInterest = await status
				.find(stringFind)
				.sort({ created_at: -1 })
				.populate({
					path: "owner",
					select: "id name avatar",
					populate: "location",
				})
				.populate({ path: "interest", select: "interest category" })
				.limit(limit + 1)
				.exec();

			let lastLoad = false;
			if (statusInterest.length < limit) {
				lastLoad = true;
			} else statusInterest.splice(limit, 1);

			if (statusInterest.length > 0) {
				res.status(200).send({
					success: true,
					message: "success",
					data: statusInterest.reverse(),
					last: lastLoad,
				});
			} else {
				res.status(200).json({
					success: true,
					message: "success",
					data: [],
					last: lastLoad,
				});
			}
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//TODO-GET : Loadmore Get Status/Post By Interest (single)
	async loadMoreSingleInterest(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let limit = eval(req.query.limit) ? eval(req.query.limit) : 8;

			let singleInterest = await status
				.find({ interest: { $in: [req.params.id] } })
				.sort({ created_at: -1 })
				.populate({
					path: "owner",
					select: "id name avatar",
					populate: "location",
				})
				.populate({ path: "interest", select: "interest category" })
				.limit(limit + 1)
				.exec();

			let lastLoad = false;
			if (singleInterest.length < limit) {
				lastLoad = true;
			} else singleInterest.splice(limit, 1);

			if (singleInterest.length > 0) {
				res.status(200).send({
					success: true,
					message: "success",
					data: singleInterest.reverse(),
					last: lastLoad,
				});
			} else {
				res.status(200).json({
					success: true,
					message: "success",
					data: [],
					last: lastLoad,
				});
			}
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//TODO-GET : Get status/post by ID : No Pagination
	async getStatusByID(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let statusData = await status.findOne({ _id: req.params.id }).populate([
				{
					path: "owner",
					select: "id name avatar",
					populate: "location",
				},
				{ path: "interest", select: "interest category icon" },
				// { path: "likeBy" , select : "name avatar"}
			]);

			if (!statusData) {
				const error = new Error("Status Data can't be appeared");
				error.statusCode = 400;
				throw error;
			} else {
				res.status(200).json({
					success: true,
					message: "Success",
					data: statusData,
				});
			}
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
	
	//TODO-GET : Search All
	async searchAll(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let limit = req.query.limit ? req.query.limit : 10;
			let skip = req.query.skip ? req.query.skip : 0;

			let statusData = [];

			const query = req.query.query
				.split(/[\ +]/)
				.filter((word) => word.length > 1);

			if (query.length) {
				let regex = matchWords([...query]);

				statusData = await status
					.find({ content: { $regex: regex, $options: "i" } })
					.sort({ updated_at: -1 })
					.populate("interest")
					.populate("owner", "name avatar id location")
					.limit(limit)
					.skip(skip)
					.exec();

				regex = matchWordsForHtml([...query]);

				statusData.forEach((status, index) => {
					statusData[index].content = status.content.replace(
						regex,
						"<b>$1</b>"
					);
				});
			}

			res.status(200).send({
				success: true,
				message: "success",
				data: statusData,
			});
		} catch (err) {
			// console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
	
	//TODO-GET : Search by User
	async searchByUser(req, res, next) {
		try {
			validationErrorHandler(req, res, next);

			let limit = req.query.limit ? req.query.limit : 10;
			let skip = req.query.skip ? req.query.skip : 0;

			let statusData = [];

			const query = req.query.query
				.split(/[\ +]/)
				.filter((word) => word.length > 1);

			if (query.length) {
				const regex = matchWords([...query]);

				statusData = await status
					.find({
						content: { $regex: regex, $options: "i" },
						owner: req.params.id,
					})
					.sort({ updated_at: -1 })
					.populate("interest")
					.populate("owner", "name avatar id location")
					.limit(limit)
					.skip(skip)
					.exec();

				regex = matchWordsForHtml([...query]);

				statusData.forEach((status, index) => {
					statusData[index].content = status.content.replace(
						regex,
						"<b>$1</b>"
					);
				});
			}

			res.status(200).send({
				success: true,
				message: "success",
				data: statusData,
			});
		} catch (err) {
			// console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
}

module.exports = new StatusController();
