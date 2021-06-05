const { comment, status, activities, notification } = require("../models");
const pushNotif = require("../utils/pushNotification");

class CommentController {
	//===============================|| get all comment ||=========================//

	async getAllComment(req, res, next) {
		try {
			let dataComment = await comment
				.find({ status_id: req.query.status_id })
				.sort({ _id: -1 })
				.populate("owner")
				.lean()
				.exec(); //id status

			let rec = (comment, threads) => {
				for (let thread in threads) {
					let value = threads[thread];

					if (thread.toString() === comment.parent_id.toString()) {
						value.children[comment._id] = comment;
						return;
					}

					if (value.children) {
						rec(comment, value.children);
					}
				}
			};

			let threads = {},
				komentar;
			for (let i = 0; i < dataComment.length; i++) {
				komentar = dataComment[i];
				komentar["children"] = {};
				let parent_id = komentar.parent_id;
				if (!parent_id) {
					threads[komentar._id] = komentar;
					continue;
				}

				rec(komentar, threads);
			}

			if (dataComment.length == 0) {
				res.status(400).json({
					success: true,
					message: "Not found",
					data: null,
				});
			} else
				res.status(200).json({
					success: true,
					message: "Success",
					data: { count: dataComment.length, comments: threads },
				});
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//===============================|| get one  comment ||=========================//

	async getOneComment(req, res, next) {
		try {
			let dataComment = await comment
				.findOne({ _id: req.params.id })
				.populate({
					path: "status_id",
					select: "content owner media interest likeBy",
				})
				.exec();

			res.status(200).json({
				success: true,
				message: "Success",
				data: dataComment,
			});
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
	//===============================|| create  comment ||=========================//
	async postComment(req, res, next) {
		try {
			// search status that I want to comment

			let data = {
				status_id: req.body.status_id,
				content: req.body.content,
				owner: req.profile.id,
				media: [],
			};

			if ("images" in req) {
				data.media = req.images;
			}

			if ("parent_id" in req.body) {
				data.parent_id = req.body.parent_id;
			}
			if ("depth" in req.body) {
				data.depth = req.body.depth;
			}

			let createComment = await comment.create(data);
			//push comment to status array
			let updateStatus = await status.findOne({ _id: req.body.status_id });
			updateStatus.comment.push(createComment._id);
			await updateStatus.save();

			let notif = await notification.create({
				type: "post_comment",
				comment_id: createComment._id,
				status_id: req.body.status_id,
				from: req.profile.id,
				to: updateStatus.owner,
			});

			await notif.populate("comment_id from to").execPopulate();

			req.io.emit("notif:" + updateStatus.owner, notif);
			
			//push notification
			let notifMessage = {
				notification : {
					title : `${notif.from.name} Comment your status`,
					body : `Comment : ${req.body.content.substring(0, 50)}`,
				},
				topic : "notif-" + updateStatus.owner
			}
			pushNotif(notifMessage);

			await activities.create({
				type: "post_comment",
				comment_id: createComment._id,
				status_id: req.body.status_id,
				owner: req.profile.id,
			});

			res.status(200).json({
				success: true,
				message: "Post comment success",
				data: createComment,
			});
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//===============================|| update comment ||=========================//

	async updateComment(req, res, next) {
		try {
			let data = {
				content: req.body.content,
				owner: req.profile.id,
			};

			let dataComment = await comment.findOneAndUpdate(
				{ _id: req.params.id }, // id comment that will be changed
				data,
				{ new: true }
			);

			if (req.images) {
				let oldImageContainer = dataComment.media.map((item) =>
					item.replace(process.env.S3_URL, "")
				);
				dataComment.media = [...oldImageContainer, ...req.images];
				await dataComment.save();
			}

			res.status(200).json({
				success: true,
				message: "Update comment Success",
				data: dataComment,
			});
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//===============================|| add like ||=========================//

	async addLike(req, res, next) {
		try {
			let findUser = await comment.findOne({ _id: req.params.id });
			if (findUser.likeBy.includes(req.profile.id)) {
				const error = new Error("You can't like twice");
				error.statusCode = 400;
				throw error;
			} else findUser.likeBy.push(req.profile.id);
			findUser.save();
			res.status(200).json({
				success: true,
				message: "Success",
				data: findUser,
			});
			await activities.create({
				type: "like_comment",
				comment_id: findUser._id,
				owner: req.profile.id,
			});
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//===============================|| remove like ||=========================//

	async removeLike(req, res, next) {
		try {
			let findUser = await comment.findOne({ _id: req.params.id });
			let indexOfLike = findUser.likeBy.indexOf(req.profile.id);
			findUser.likeBy.splice(indexOfLike, 1);
			let deleteLike = await comment.findOneAndUpdate(
				{ _id: findUser._id },
				findUser,
				{ new: true }
			);
			res.status(200).json({
				success: true,
				message: "Success",
				data: deleteLike,
			});
			await activities.deleteOne({ _id: req.params.id });
			next();
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
	//===============================|| delete comment ||=========================//

	async deleteComment(req, res) {
		try {
			let deleteCom = await comment.deleteOne({ _id: req.params.id }); //id comment that want to delete

			await activities.deleteOne({ _id: req.params.id });
			res.status(200).json({
				success: true,
				message: "Delete comment Success",
				data: deleteCom.deletedCount,
			});
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//======================|| Delete Images on upload on AWS S3 ||=====================//
	async imageDelete(req, res, next) {
		try {
			let findComment = await comment.findOne({ _id: req.params.id });
			let indexOfImages = findComment.media.indexOf(req.query.media);
			findComment.media.splice(indexOfImages, 1);
			let deleteImage = await comment.findOneAndUpdate(
				{ _id: findComment._id },
				findComment,
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
}

module.exports = new CommentController();
