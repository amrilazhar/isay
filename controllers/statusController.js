const { status, comment, profile } = require("../models");

class StatusController {
	//TODO : create status/post
	async createStatus(req, res) {
		try {
			// function : create
			let posting = await status.create(req.body);
			// if success
			return res.status(200).json({
				success: true,
				message: "Success",
				data: posting,
			});
		} catch (e) {
			console.log(e);
			// if failed
			return res.status(500).json({
				message: "Internal Server Error",
				error: e.message,
			});
		}
	}

	//TODO : Update status/post
	async updateStatus(req, res) {
		try {
			// function : update
			let data = await status.findOneAndUpdate(
				{
					_id: req.params.id,
				},
				req.body,
				{
					new: true,
				}
			);
			// if success
			return res.status(200).json({
				success: true,
				message: "Success",
				data,
			});
		} catch (e) {
			console.log(e);
			// if failed
			return res.status(500).json({
				message: "Internal Server Error",
				error: e.message,
			});
		}
	}

	//TODO : Get status/post by User
	async getStatusByUser(req, res) {
		try {
			let userPosting = await status.findById(req.params.id);

			// if status not found
			if (!userPosting) {
				return res.status(400).json({
					message: `Status not found`,
				});
			}

			// if success
			return res.status(200).json({
				message: "Success",
				data: userPosting,
			});
		} catch (e) {
			console.log(e);
			// if failed
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

	//TODO : Get status/post by interest
	async getStatusAll(req, res) {
		try {
		} catch (e) {
			console.log(e);
		}
	}

	//TODO : Delete status/post
	async deleteStatus(req, res) {
		try {
			let data = await status.deleteOne({ _id: req.params.id }).exec();
			// if success
			return res.status(200).json({
				success: true,
				message: "Success to delete status",
			});
		} catch (e) {
			console.log(e);
			// if failed
			return res.status(500).json({
				message: "Internal Server Error",
				error: e.message,
			});
		}
	}
}

module.exports = new StatusController();
