const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const bcrypt = require("bcrypt"); // Import bcrypt

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: String,
      required : true,
      default : false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);



UserSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("user", UserSchema, "user");
