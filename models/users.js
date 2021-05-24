const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		firstName: {
			type: String,
			// required: true,
		},
		lastName: {
			type: String,
			// required: true,
		},
		admin: {
			type: Boolean,
			required: true,
			default: false,
		},
		emailVerified: {
			type: Boolean,
			required: true,
			default: false,
		},
		newEmail: {
			type: String,
		},
		emailToken: {
			type: String,
		},
		emailExpiration: {
			type: Date,
		},
		resetPasswordToken: {
			type: String,
		},
		resetPasswordExpiration: {
			type: Date,
		},
		profile: {
			type: mongoose.Types.ObjectId,
			required: false,
			ref: "profile",
			default: null,
		},
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

UserSchema.pre("save", function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	this.password = bcrypt.hashSync(this.password, 12);
	next();
});

UserSchema.methods.comparePassword = async function (plaintext) {
	return bcrypt.compareSync(plaintext, this.password);
};

UserSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("User", UserSchema);
