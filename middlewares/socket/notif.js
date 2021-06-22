const { notification, profile } = require("../../models");
const { tokenDecoder } = require("../../utils/chatUtils");

async function startSocketNotif(req, res) {
	try {
		req.profile = (await tokenDecoder(req)).profile;

		//join room to receive targeted emit
		req.socket.join(req.profile.id);

		//set user status as Online
		req.io.emit("online:" + req.profile.id, true);
		await profile.findByIdAndUpdate(req.profile.id, { onlineStatus: true });

		req.socket.on("online:" + req.profile.id, async (data) => {
			await profile.findByIdAndUpdate(req.profile.id, { onlineStatus: data });
		});

		//start listening event read notif
		req.socket.on("readNotif", async (data) => {
			await notification.findByIdAndUpdate(data.notif_id, { readed: true });
			req.io.to(req.profile.id).emit("readedNotif:" + req.profile.id, data.notif_id);
		});

		//disconnect the connection
		req.socket.on("disconnect", async () => {
			await profile.findByIdAndUpdate(req.profile.id, { onlineStatus: false });
			//set user status as Offline when disconnect
			req.io.emit("online:" + req.profile.id, false);
			req.socket.disconnect();
		});
	} catch (error) {
		console.log(error);
	}
}

module.exports = { startSocketNotif };
