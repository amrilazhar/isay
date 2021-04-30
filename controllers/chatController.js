const { chat, profile } = require("../models");

class ChatController {
  //get message history when starting conversation
  async getMessageHistory(req, res) {
    try {
      let dataUser = chat.message
        .find({ chatRoom: req.body.chatRoom })
        .sort({ updated_at: -1 })
        .limit(30)
        .exec();

      return res.status(200).json({ message: "success", data: dataUser });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "internal server error" });
    }
  }

  //get newest message (optional)
  async getNewMessage(req, res) {
    try {
      let messageID = req.query.messageID
        ? { _id: { $gt: req.query.messageID } }
        : {};

      let lastMessage = await chat.message
        .find(messageID)
        .sort({ updated_at: -1 })
        .exec();

      if (lastMessage.length > 0) {
        req.io.sockets.in(chatRoom._id).emit("messages", lastMessage);
        return res.status(200).json({ message: "success", data: lastMessage });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "internal server error" });
    }
  }

  //create new room if not exist
  async createRoom(req, res) {
    try {
      let from = mongoose.Types.ObjectId(req.user.id);
      let to = req.query.to;
      let chatRoom = await chat.room.findOneAndUpdate(
        {
          member: {
            $all: [{ $elemMatch: { $eq: from } }, { $elemMatch: { $eq: to } }],
          },
        },
        {
          member: [req.user._id, to],
        },
        {
          upsert: true,
          new: true,
        }
      );

      if (!chatRoom) {
        return res.status(400).json({ message: "error create room" });
      }

      return res.statu(200).json({ message: "room created", data: chatRoom });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "internal serrver error" });
    }
  }

  //send and get new message
  async send(req, res) {
    let from = mongoose.Types.ObjectId(req.user.id);
    let to = req.body.to;
    let chatRoom = await chat.room.findOneAndUpdate(
      {
        member: {
          $all: [{ $elemMatch: { $eq: from } }, { $elemMatch: { $eq: to } }],
        },
      },
      {
        member: [req.user._id, to],
      },
      {
        upsert: true,
        new: true,
      }
    );
    if (chatRoom._id !== req.body.chatRoom) {
      return res
        .status(403)
        .json({ message: "you are not the member of this chat id" });
    }

    await Message.create({
      chatRoom: chatRoom._id,
      message: { message: req.body.content, from: from, to: to },
    });

    req.io.sockets.in(chatRoom._id).emit("messages", req.body.content);
  }
}

module.exports = new ChatController();
