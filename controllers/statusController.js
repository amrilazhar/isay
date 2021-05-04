const { status, comment, profile } = require("../models");

class StatusController {
	//TODO : create status/post
	async createStatus(req, res) {
		try {
			let data = {
				content: req.body.content,
				owner: req.body.owner,
				media: req.body.media ? req.body.media : "images.jpg",
				comment: req.body.comment,
				likeBy: req.body.likeBy,
			};
			let statusCreate = await status.create(data);
			if (!statusCreate) {
				return res.status(400).json({
					message: "Create Status failed",
					error: statusCreate,
				});
			} else {
				return res.status(201).json({
					success: true,
					message: "Success",
					data: statusCreate,
				});
			}
		} catch (e) {
			console.log(e);
			return res.status(500).json({
				message: "Internal Server Error",
				error: e.message,
			});
		}
	}

	//TODO : Update status/post
	async updateStatus(req, res) {
		try {
			let data = {
				content: req.body.content,
				owner: req.body.owner,
				media: req.body.media ? req.body.media : "images.jpg",
				comment: req.body.comment,
				likeBy: req.body.likeBy,
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
			if (!statusUpdate) {
				return res.status(400).json({
					message: "Status data can't be appeared",
					error: statusUpdate,
				});
			} else {
				return res.status(201).json({
					success: true,
					message: "Success",
					data: statusUpdate,
				});
			}
		} catch (e) {
			console.log(e);
			return res.status(500).json({
				message: "Internal Server Error",
				error: e.message,
			});
		}
	}

	//TODO : Get status/post by User
	async getStatusByUser(req, res) {
		try {
			let statusUsers = await status
				.findById({ _id: req.params.id })
				.populate({
					path:"profile",
					select:"name avatar bio activities interest location",
				})
				.populate({
					path:"status",
					select:"content owner",
				});
			if (!statusUsers) {
				return res.status(400).json({
					message: "Status user can't be appeared",
					error: statusUsers,
				});
			} else {
				return res.status(201).json({
					message: "Success",
					data: statusUsers,
				});
			}
		} catch (e) {
			console.log(e);
			return res.status(500).json({
				message: "Internal Server Error",
				error: e.message,
			});
		}
	}

	//TODO : Get status/post by interest
	async getStatusByInterest(req, res) {
		try {
		} catch (e) {
			console.log(e);
		}
	}

	//TODO : Get all status
	async getStatusAll(req, res) {
		try {
			let statusAll = await status.find().exec();
			if (!statusAll == 0) {
				return res.status(400).json({ 
					message: "No status found", 
					data: null 
				});
			} else {
				return res.status(200).json({ 
					message: "Success", 
					data: statusAll 
				});
			}
		} catch (e) {
			console.log(e);
			return res.status(500).json({
				message: "Internal Server Error",
				error: e.message,
			});
		}
	}

	//TODO : Delete status/post
	async deleteStatus(req, res) {
		try {
			let statusDelete = await status.deleteOne({ _id: req.params.id });
			if (!statusDelete) {
				return res.status(400).json({
					message: "Delete status failed",
					error: statusDelete,
				});
			} else {
				return res.status(200).json({
					success: true,
					message: "Success",
				});
			}
		} catch (e) {
			console.log(e);
			return res.status(500).json({
				message: "Internal Server Error",
				error: e.message,
			});
		}
	}
}

module.exports = new StatusController();
