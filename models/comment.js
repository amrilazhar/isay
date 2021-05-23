const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const CommentSchema = new mongoose.Schema(
	{
		status_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "status",
		},
		depth: {
			type: Number,
			default: 1,
		},
		parent_id: {
			type: mongoose.Schema.Types.ObjectId,
			default: null,
		},
		content: {
			type: String,
			required: false,
		},
		media: {
			type: Array,
			required: false,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "profile",
		},
		likeBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "profile",
			},
		],
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

CommentSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("comment", CommentSchema, "comment");
