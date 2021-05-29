const { notification } = require("../../models");
const { tokenDecoder } = require("../../utils/chatUtils");

async function startSocketNotif(req, res) {
	try {
		req.profile = (await tokenDecoder(req)).profile;
		//set user status as Online
		req.io.emit("online:" + req.profile.id, true);

		//start listening event read notif
		req.socket.on("readNotif", async (data) => {
			await notification.findByIdAndUpdate(data.notif_id, { readed: true });
			req.io.emit("updatedReadNotif", data.notif_id);
		});

		//disconnect the connection
		req.socket.on("disconnect", () => {
			console.log("user disconnect");
			req.socket.leave(req.socket.handshake.query.roomID);

			//set user status as Offline when disconnect
			req.io.emit("online:" + req.profile.id, false);

			req.socket.disconnect();
		});

	} catch (error) {
		console.log(error);
	}
}

module.exports = { startSocketNotif };
