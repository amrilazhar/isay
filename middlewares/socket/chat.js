const mongoose = require("mongoose");
const { chat, profile } = require("../../models");
const crypto = require("crypto");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { tokenDecoder } = require("../../utils/chatUtils");

async function startSocketChat(req, res) {
	try {
		req.profile = (await tokenDecoder(req)).profile;
		let from = mongoose.Types.ObjectId(req.profile.id);

		req.socket.join(req.socket.handshake.query.roomID);

		//set user status as Online
		req.io.emit("online:" + req.profile.id, true);

		//start listening event set read status
		req.socket.on("readMessage", async (data) => {
			await chat.message.findByIdAndUpdate(data.message_id, { readed: true });
			req.io
				.to(req.socket.handshake.query.roomID)
				.emit("updatedReadMessage", data.message_id);

			req.io.emit("readedChat:" + req.profile.id, data.message_id);
		});

		//disconnect the connection
		req.socket.on("disconnect", async () => {
			console.log("user disconnect");
			req.socket.leave(req.socket.handshake.query.roomID);
			//set user status as Offline when disconnect
			req.io.emit("online:" + req.profile.id, false);

			req.socket.disconnect();
		});

		//start lisntening event newChatMessage
		req.socket.on("newChatMessage", async (message) => {
			if (message.message_type !== "text") {
				req.utils = {
					handshake: req.socket.handshake.query.roomID,
					message: message,
					from: from,
				};
				socketImageUpload(req, res);
			} else {
				chat.message
					.create({
						chatRoom: message.chatRoom,
						message: message.content,
						from: from,
						to: message.to,
						message_type: "text",
					})
					.then(async (query) => {
						//populate the data with user profile data
						let sendMess = await query
							.populate("from", "name avatar")
							.populate("to", "name avatar")
							.execPopulate();

						//emit to specific room if message create message success
						req.io
							.to(req.socket.handshake.query.roomID)
							.emit("messageFromServer", sendMess);

						req.io.emit("chat:" + message.to, sendMess);
						req.io.emit("chat:" + message.from, sendMess);
					})
					.catch((e) => {
						//emit to specific room if message create message error
						console.log(e);
						req.io
							.to(req.socket.handshake.query.roomID)
							.emit("messageErrorFromServer", "something wrong");
					});
			}
		});
	} catch (error) {
		console.log(error);
	}
}

async function socketImageUpload(req, res) {
	try {
		let from = mongoose.Types.ObjectId(req.profile.id);
		let fileName = crypto.randomBytes(16).toString("hex");
		const mimeArr = ["image/jpeg", "image/png", "image/gif", "image/bmp"];
		let mimeType = "";
		let contentType = "";
		let imageUrl = "";

		//get Mime Type
		mimeArr.forEach((item, i) => {
			if (req.utils.message.content.indexOf(item) > -1) {
				mimeType = item.split("/")[1];
				contentType = mimeArr[i];
			}
		});

		//if mime type not match return error
		if (mimeType == "") {
			req.io.to(req.utils.handshake).emit("messageErrorFromServer", {
				message: "file must be JPEG, GIF, PNG or BMP",
			});
		}
		// Set the AWS region
		const REGION = "ap-southeast-1"; //e.g. "us-east-1"

		// // Set the parameters.
		let imageBuffer = Buffer.from(
			req.utils.message.content.replace(/^data:image\/\w+;base64,/, ""),
			"base64"
		);

		const uploadParams = {
			ACL: "public-read",
			Bucket: process.env.S3_BUCKET_NAME,
			Key: `images/chat/${req.utils.handshake}/${fileName}.${mimeType}`,
			Body: imageBuffer,
			ContentEncoding: "base64",
			ContentType: contentType,
		};

		// Create Amazon S3 service client object.
		const s3 = new S3Client({
			region: REGION,
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY,
				secretAccessKey: process.env.S3_SECRET_KEY,
			},
		});

		// Create and upload the object to the specified Amazon S3 bucket.
		const run = async () => {
			try {
				const data = await s3.send(new PutObjectCommand(uploadParams));
				return uploadParams.Key;
			} catch (err) {
				console.log("Error", err);
			}
		};
		imageUrl = await run();

		chat.message
			.create({
				chatRoom: req.utils.message.chatRoom,
				message: process.env.S3_URL + imageUrl,
				from: req.utils.from,
				to: req.utils.message.to,
				message_type: "image",
			})
			.then(async (query) => {
				//populate the data with user profile data
				let sendMess = await query
					.populate("from", "name avatar")
					.populate("to", "name avatar")
					.execPopulate();				

				//emit to specific room if message create message success
				req.io.to(req.utils.handshake).emit("messageFromServer", sendMess);
				req.io.emit("chat:" + req.utils.message.to, sendMess);
				req.io.emit("chat:" + req.utils.from, sendMess);
			})
			.catch((e) => {
				//emit to specific room if message create message error
				console.log(e);
				req.io
					.to(req.utils.handshake)
					.emit("messageFromServer", "something wrong in image upload");
			});
	} catch (error) {
		console.log(error);
	}
}

module.exports = { startSocketChat, socketImageUpload };
