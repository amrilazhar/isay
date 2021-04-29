const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const ChatRoomSchema = new mongoose.Schema(
  {
    member : {
      type: Array,
      required: true,
    },
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
      sender : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "profile"
      },
    },
    {
      timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    }
  );


module.exports.chatRoom = mongoose.model("chatRoom", ChatRoomSchema, "chatRoom");
module.exports.chatData = mongoose.model("chatData", ChatDataSchema, "chatData");
