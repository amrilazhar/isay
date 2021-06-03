const mongoose = require("mongoose");
const { chat, profile } = require("../models");

class ChatController {
	//get message history when starting conversation
	async getMessageHistory(req, res, next) {
		try {
			let limit = eval(req.query.limit) ? eval(req.query.limit) : 30;
			let skip = eval(req.query.skip) ? eval(req.query.skip) : 0;
			let dataMessage = await chat.message
				.find({ chatRoom: req.params.chatRoom })
				.sort({ created_at: -1 })
				.populate("from", "name avatar")
				.populate("to", "name avatar")
				.limit(limit + 1)
				.skip(skip)
				.exec();
			let lastLoad = false;
			if (dataMessage.length < limit) {
				lastLoad = true;
			} else dataMessage.splice(limit, 1);

			if (dataMessage.length > 0) {
				res.status(200).send({
					success: true,
					message: "success",
					data: dataMessage.reverse(),
					last: lastLoad,
				});
			} else {
				res
					.status(200)
					.json({
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

	//create new room if not exist
	async joinRoom(req, res, next) {
		try {
			let from = mongoose.Types.ObjectId(req.profile.id);
			let to = mongoose.Types.ObjectId(req.body.to);

			let chatRoom = await chat.room
				.findOne({
					member: { $all: [from, to] },
				})
				.populate("member", "_id name avatar onlineStatus");

			//================ create a room if user has not been registered in private room
			if (chatRoom == null) {
				chatRoom = await chat.room.create({ member: [from, to] });

				await chatRoom
					.populate("member", "_id name avatar onlineStatus")
					.execPopulate();

				//print error if failed to create
				if (!chatRoom) {
					return res
						.status(400)
						.json({ success: false, message: "error create room" });
				} else {
					res.status(200).json({
						success: true,
						message: "room created",
						data: chatRoom,
						receiverOnline: req.userOnline,
					});
					next();
				}
			}
			//=============END  create a room if user has not been registered in private room
			res.status(200).json({
				success: true,
				message: "room created",
				data: chatRoom,
				receiverOnline: req.userOnline,
			});
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	async getRoomList(req, res) {
		try {
			let roomList = [];
			let objCont = {};
			//get all room id that has been chated
			let room = await chat.room
				.find({ member: { $in: [req.profile.id] } })
				.lean()
				.exec();
			// get all last message from every room
			let getLastChat = room.map(
				async (item) =>
					await chat.message
						.find({ chatRoom: item._id })
						.limit(1)
						.sort({ created_at: -1 })
						.populate("from", "name avatar")
						.populate("to", "name avatar")
						.exec()
			);

			let lastChat = await Promise.all(getLastChat);

			let idLastChat = lastChat.map((item) => {
				if (item.length > 0) {
					//insert item to object container
					objCont[item[0]._id] = item[0];
					return item[0]._id;
				} else return null;
			});

			idLastChat.sort();
			idLastChat.reverse();
			idLastChat.forEach((item) => {
				if (item)
					roomList.push({ ...objCont[item]._doc, chatOwner: req.profile.id });
			});

			return res
				.status(200)
				.json({ success: true, message: "success", data: roomList });
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	async loadOlderMessage(req, res, next) {
		try {
			let limit = eval(req.query.limit) ? eval(req.query.limit) : 30;
			let dataMessage = await chat.message
				.find({
					_id: { $lt: req.query.lastMessage },
					chatRoom: req.query.chatRoom,
				})
				.sort({ created_at: -1 })
				.populate("from", "name avatar")
				.populate("to", "name avatar")
				.limit(limit + 1)
				.exec();

			let lastLoad = false;
			if (dataMessage.length < limit) {
				lastLoad = true;
			} else dataMessage.splice(limit, 1);

			if (dataMessage.length > 0) {
				res.status(200).send({
					success: true,
					message: "success",
					data: dataMessage.reverse(),
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
}

module.exports = new ChatController();
