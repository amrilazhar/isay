const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const mongoosePaginate = require("mongoose-paginate-v2");

const ProfileSchema = new mongoose.Schema(
	{
		bio: {
			type: String,
			required: false,
			default: "",
		},
		name: {
			type: String,
			required: false,
		},
		interest: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "interest",
			},
		],
		activities: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "activities",
			},
		],
		post: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "status",
			},
		],
		avatar: {
			type: String,
			required: false,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: false,
			ref: "user",
		},
		location: {
			type: mongoose.Schema.Types.ObjectId,
			required: false,
			ref: "location",
		},
		onlineStatus: {
			type: Boolean,
			required: false,
			default: false,
		},
		backgroundImage: {
			type: String,
			required: false,
			default: `images/background_profile_isay.jpeg`,
			get : getMedia,
		},
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
		toJSON: { getters: true },
	}
);

function getMedia(image) {
	return process.env.S3_URL + image;
}

ProfileSchema.plugin(mongoosePaginate);
ProfileSchema.plugin(mongoose_delete, { overrideMethods: "all" });
module.exports = mongoose.model("profile", ProfileSchema, "profile");
