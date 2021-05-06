const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const ProfileSchema = new mongoose.Schema(
  {
    bio: {
      type: String,
      required: false,
      default : ""
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
    avatar : {
      type : String,
      required : false,

    },
    user : {
      type : String,
      required : true,
      ref : "user"
    },
    location : {
      type : mongoose.Schema.Types.ObjectId,
      required : false,
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: { getters: true },
  }
);

ProfileSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("profile", ProfileSchema, "profile");
