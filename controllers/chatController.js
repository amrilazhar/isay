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
  async joinRoom(req, res) {
    try {
      let from = req.user.id;
      let to = req.body.to;
      console.log("join room");
      // let chatRoom = await chat.room.findOne({
      //   member: { $all: [from, to] },
      // });

      //============checking manually if the user has been create a private room each other
      let roomFind = await chat.room.find({}).exec();
      let chatRoom = null;

      if (roomFind.length > 0) {
        for (let index = 0; index < roomFind.length; index++) {
          let match = 0;
          roomFind[index].member.forEach((item, idx) => {
            if (String(item) == from || String(item)) {
              match++;
            }
          });
          if (match == 2) {
            chatRoom = roomFind[index];
            index = roomFind.length;
          }
        }
      }
      //=========END checking manually if the user has been create a room

      //================ create a room if user has not been registered in private room
      if (chatRoom == null) {
        chatRoom = await chat.room.create({ member: [from, to] });
        //print error if failed to create
        if (!chatRoom) {
          return res.status(400).json({ message: "error create room" });
        } else {
          return res
            .status(200)
            .json({ message: "room created", data: chatRoom });
        }
      }
      //=============END  create a room if user has not been registered in private room

      //===================== start connection if room is exist
      //remove all listener before start connection, it's useful when user refresh page multiple times,
      //becaus if it's nor removed then the other listener will emit the same thing to the user that can cause multiple message send
      req.io.removeAllListeners("connection");

      //star the listener
      req.io.on("connection", (socket) => {
        socket.join(socket.handshake.query.roomID);
        console.log("connect");
        //start lisntening event newChatMessage
        socket.on("newChatMessage", async (message) => {
          console.log(message);
          console.log(socket.id, "====id");
          let insertMessage = await chat.message
            .create({
              chatRoom: message.chatRoom,
              message: message.content,
              from: from,
              to: message.to,
            })
            .then(async (query) => {
              //populate the data with user profile data
              let sendMess = await query
                .populate("from", "name")
                .populate("to", "name")
                .execPopulate();
              console.log(sendMess);

              //emit to specific room if message create message success
              req.io
                .to(socket.handshake.query.roomID)
                .emit("messageFromServer", sendMess);
            })
            .catch((e) => {
              //emit to specific room if message create message error
              console.log(e);
              req.io
                .to(socket.handshake.query.roomID)
                .emit("messageFromServer", "something wrong");
            });
        });

        //disconnect the connection
        socket.on("disconnect", () => {
          socket.leave(socket.handshake.query.roomID);
          socket.disconnect();
        });
      });
      return res.status(200).json({ message: "room created", data: chatRoom });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "internal serrver error" });
    }
  }

  //not used for now
  async send(req, res) {
    try {
      let from = req.user.id;
      let to = req.body.to;
      let chatRoom = await chat.room.findOne({ member: { $all: [from, to] } });

      // console.log(chatRoom._id, "===function send", req.body.chatRoom);

      if (chatRoom._id != req.body.chatRoom) {
        return res
          .status(403)
          .json({ message: "you are not the member of this chat id" });
      }

      await chat.message.create({
        chatRoom: chatRoom._id,
        message: req.body.content,
        from: from,
        to: to,
      });

      // let emit = req.io.sockets.emit("newChatMessage", {
      //   message: req.body.content,
      //   from: from,
      //   to: to,
      // });

      // if (emit) {
      //   console.log(chatRoom._id, "socket room");
      //   // console.log(req.io.sockets, "=====socketIO");

      // }
      return res.status(200).json({ message: "success emit" });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new ChatController();
