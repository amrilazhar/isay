const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const mongoosePaginate = require('mongoose-paginate-v2');

const ProfileSchema = new mongoose.Schema(
  {
    bio: {
      type: String,
      required: false,
      default : "No description"
    },
    name: {
      type: String,
      required: false,
    },
    interest: [
      {
        type: Array,
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
      }
    ],
    avatar : {
      type : String,
      required : false,
      get : getAvatar,
    },
    user : {
      type : mongoose.Schema.Types.ObjectId,
      required : false,
      ref : "user"
    },
    location : {
      type : mongoose.Schema.Types.ObjectId,
      required : false,
      ref: "location"
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

function getAvatar(image) {
  if (image[0] !== "/") {
    image = "/" + image;
  }
  return process.env.PUBLIC_URL
    ? process.env.PUBLIC_URL + `/images/avatar${image}`
    : `/images/avatar${image}`;
}

ProfileSchema.plugin(mongoosePaginate);
ProfileSchema.plugin(mongoose_delete, { overrideMethods: "all" });
module.exports = mongoose.model("profile", ProfileSchema, "profile");
