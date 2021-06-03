const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const mongoosePaginate = require("mongoose-paginate-v2");

const StatusSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: false,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: false,
			ref: "profile",
		},
		// media : [{type : String, get : getMedia, required : false}],
		media:{
			type: Array,
			get : getMediaArr,
			required : false,
		},
		comment: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "comment",
			},
		],
		interest: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "interest",
			},
		],
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
		toJSON: { getters: true },
		toObject: { getters: false },
	}
);

function getMediaArr(arr) {
	return arr.map(image=>{
		return process.env.S3_URL + image;
	})
}

StatusSchema.plugin(mongoosePaginate);
StatusSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("status", StatusSchema, "status");
