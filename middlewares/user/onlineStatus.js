const profile = require("../../models/profile");
const user = require("../../models/users");

module.exports.setOnlineStatus = async (req, res, next) => {
	if (req.profile.id !== null) {
		await profile.findByIdAndUpdate(req.profile.id, { onlineStatus: true });
	} else {
		let profile = (await user.findOne(req.user.id)).profile;
		if (profile) {
			await profile.findByIdAndUpdate(profile, { onlineStatus: true });
		}		
	}
	next();
};

module.exports.getOnlineStatus = async (req, res, next) => {
	req.userOnline = (
		await profile.findOne({ _id: req.profile.id })
	).onlineStatus;
	next();
};
