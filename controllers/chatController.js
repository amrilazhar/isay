const mongoose = require("mongoose");
const { chat, profile } = require("../models");

class ChatController {
  //get message history when starting conversation
  async getMessageHistory(req, res, next) {
    try {
      let limit = eval(req.query.limit) ? eval(req.query.limit) : 30;
      let skip = eval(req.query.skip) ? eval(req.query.skip) : 0;
      let dataMessage = await chat.message
        .find({ chatRoom: req.params.chatRoom })
        .sort({ created_at: -1 })
        .populate("from", "name avatar")
        .populate("to", "name avatar")
        .limit(limit)
        .skip(skip)
        .exec();

      if (dataMessage.length > 0) {
        res.status(200).send({
          success: true,
          message: "success",
          data: dataMessage.reverse(),
        });
      } else {
        res.status(200).json({ success: true, message: "success", data: [] });
      }
      next();
    } catch (error) {
      console.log(error);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
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

      //================ create a room if user has not been registered in private room
      if (chatRoom == null) {
        chatRoom = await chat.room.create({ member: [from, to] });
        //print error if failed to create
        if (!chatRoom) {
          return res
            .status(400)
            .json({ success: true, message: "error create room" });
        } else {
          res
            .status(200)
            .json({ success: true, message: "room created", data: chatRoom });
          next();
        }
      }
      //=============END  create a room if user has not been registered in private room
      res
        .status(200)
        .json({ success: true, message: "room created", data: chatRoom });
    } catch (error) {
      console.log(error);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  async getRoomList(req, res) {
    try {
      let roomList = [];
      let objCont = {};
      //get all room id that has been chated
      let room = await chat.room
        .find({ member: { $in: [req.profile.id] } })
        .lean()
        .exec();
      // get all last message from every room
      let getLastChat = room.map(
        async (item) =>
          await chat.message
            .find({ chatRoom: item._id })
            .limit(1)
            .sort({ created_at: -1 })
            .populate("from", "name avatar")
            .populate("to", "name avatar")
            .exec()
      );

      let lastChat = await Promise.all(getLastChat);

      let idLastChat = lastChat.map((item) => {
        if (item.length > 0) {
          //insert item to object container
          console.log(item[0], "============item");
          objCont[item[0]._id] = item[0];
          return item[0]._id;
        } else return null;
      });

      console.log(idLastChat, "=== last chat");
      idLastChat.sort();
      idLastChat.reverse();
      idLastChat.forEach((item) => {
        if (item) roomList.push(objCont[item]);
      });

      return res
        .status(200)
        .json({ success: true, message: "success", data: roomList });
    } catch (error) {
      console.log(error);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  async loadOlderMessage(req, res, next) {
    try {
      let limit = eval(req.query.limit) ? eval(req.query.limit) : 2;
      let dataMessage = await chat.message
        .find({
          _id: { $lt: req.query.lastMessage },
          chatRoom: req.query.chatRoom,
        })
        .sort({ created_at: -1 })
        .populate("from", "name avatar")
        .populate("to", "name avatar")
        .limit(limit)
        .exec();
      let lastLoad = false;
      if (dataMessage.length < limit) {
        lastLoad = true;
      }
      if (dataMessage.length > 0) {
        res.status(200).send({
          success: true,
          message: "success",
          data: dataMessage.reverse(),
          last: lastLoad,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "success",
          data: [],
          last: lastLoad,
        });
      }
    } catch (error) {
      console.log(error);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
}

module.exports = new ChatController();
