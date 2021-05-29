const { notification } = require("../models");

class NotificationController {
	async getNotifHistory(req, res, next) {
		try {
			const options = {
				sort: { created_at: -1 },
				page: req.query.page ? (req.query.page < 20 ? req.query.page : 20) : 1,
				limit: req.query.limit ? req.query.limit : 20,
				populate: [
					{ path: "status_id", populate: "interest" },
					{ path: "chatMsg_id" },
					{ path: "comment_id" },
					{ path: "from" },
					{ path: "to" },
				],
			};
			//get data from database
			let dataNotif = await notification.paginate(
				{ to: req.profile.id, type: { $ne: "chat" } },
				options
			);

			//restruktur data mongoose paginate
			let returnData = { ...dataNotif, data: dataNotif.docs };
			delete returnData.docs;

			//send data
			return res.status(200).json({
				success: true,
				message: "success",
				...returnData,
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	}

	async getUnreadedNotifCount(req, res, next) {
		try {
			let chatCont = [];
			let notifCont = [];
			//get data from database
			let unreadedNotifCount = await notification
				.find({
					to: req.profile.id,
					readed: false,
				})
				.exec();

			if (unreadedNotifCount) {
				unreadedNotifCount.forEach((item) => item.type === "chat" ? chatCont.push(item) : '');
				unreadedNotifCount.forEach((item) => item.type !== "chat" ? notifCont.push(item) : '');
			}

			//send data
			return res.status(200).json({
				success: true,
				message: "success",
				chatCount: chatCont.length,
				notifCount: notifCont.length,
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	}

	async setReadStatus(req, res, next) {
		try {
			//get data from database
			let setRead = await notification.findOneAndUpdate(
				{ to: req.profile.id, _id: req.params.id },
				{ readed: true },
				{ new: true }
			);

			if (setRead) {
				return res.status(200).json({ success: true, message: "readed" });
			}
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	}
}

module.exports = new NotificationController();
