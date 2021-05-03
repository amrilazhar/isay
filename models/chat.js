const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const ChatRoomSchema = new mongoose.Schema(
  {
    member : [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref : 'profile',
    }],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const ChatDataSchema = new mongoose.Schema(
    {
      chatRoom : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      message : {
        type: String,
        required: false,
      },
      from : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "profile"
      }, 
      to : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "profile"
      }
    },
    {
      timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    }
  );


module.exports.room = mongoose.model("chatRoom", ChatRoomSchema, "chatRoom");
module.exports.message = mongoose.model("chatData", ChatDataSchema, "chatData");
