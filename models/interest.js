const mongoose = require("mongoose");

const InterestSchema = new mongoose.Schema(
	{
		interest: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: false,
		},
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

module.exports = mongoose.model("interest", InterestSchema, "interest");
