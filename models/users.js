const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const bcrypt = require("bcrypt"); // Import bcrypt

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      // required: true,
    }, 
    lastName: {
      type: String,
      // required: true,
    }, 
    email: {
      type: String,
      required: true,
      unique: true,
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

UserSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("User", UserSchema);
