const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const NotificationSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: false,
		},
		status_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: false,
			default: null,
			ref: "status",
		},
		chatMsg_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: false,
			default: null,
			ref: "chatData",
		},
		comment_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: false,
			default: null,
			ref: "comment",
		},
		from: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "profile",
		},
		to: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "profile",
		},
		readed: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

NotificationSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model(
	"notification",
	NotificationSchema,
	"notification"
);
