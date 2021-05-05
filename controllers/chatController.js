const mongoose = require("mongoose");
const { chat, profile } = require("../models");

class ChatController {
  //get message history when starting conversation
  async getMessageHistory(req, res) {
    try {
      let limit = req.query.limit ? req.query.limit : 30;
      let skip = req.query.skip ? req.query.skip : 0;
      let dataMessage = await chat.message
        .find({ chatRoom: req.params.chatRoom })
        .sort({ updated_at: 1 })
        .populate("from", "name")
        .populate("to", "name")
        .limit(limit)
        .skip(skip)
        .exec();

      if (dataMessage.length > 0) {
        return res.status(200).send({ message: "success", data: dataMessage });
      } else {
        return res.status(200).json({ message: "success", data: [] });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "internal server error" });
    }
  }

  //create new room if not exist
  async joinRoom(req, res, next) {
    try {
      let from = mongoose.Types.ObjectId(req.profile.id);
      let to = mongoose.Types.ObjectId(req.body.to);

      let chatRoom = await chat.room.findOne({
        member: { $all: [from, to] },
      });

      // //============checking manually if the user has been create a private room each other
      // let roomFind = await chat.room.find({}).exec();
      // let chatRoom = null;

      // if (roomFind.length > 0) {
      //   for (let index = 0; index < roomFind.length; index++) {
      //     let match = 0;
      //     roomFind[index].member.forEach((item, idx) => {
      //       if (String(item) == from || String(item)) {
      //         match++;
      //       }
      //     });
      //     if (match == 2) {
      //       chatRoom = roomFind[index];
      //       index = roomFind.length;
      //     }
      //   }
      // }
      // //=========END checking manually if the user has been create a room

      //================ create a room if user has not been registered in private room
      if (chatRoom == null) {
        chatRoom = await chat.room.create({ member: [from, to] });
        //print error if failed to create
        if (!chatRoom) {
          return res.status(400).json({ message: "error create room" });
        } else {
          res.status(200).json({ message: "room created", data: chatRoom });
          next();
        }
      }
      //=============END  create a room if user has not been registered in private room
      res.status(200).json({ message: "room created", data: chatRoom });
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "internal serrver error" });
    }
  }
}

module.exports = new ChatController();
