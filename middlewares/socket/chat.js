const mongoose = require("mongoose");
const { chat, profile } = require("../../models");
const crypto = require("crypto");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

async function startSocketChat(req, res, next) {
  try {
    let from = mongoose.Types.ObjectId(req.profile.id);
    //===================== start connection if room is exist
    //remove all listener before start connection, it's useful when user refresh page multiple times,
    //becaus if it's nor removed then the other listener will emit the same thing to the user that can cause multiple message send
    req.io.removeAllListeners("connection");

    //star the listener
    req.io.on("connection", (socket) => {
      socket.join(socket.handshake.query.roomID);
      console.log("connect");

      //start listening event set read status
      socket.on("readMessage", async (data) => {
        await chat.message.findByIdAndUpdate(data.message_id, { readed: true });
        let emit = req.io
          .to(socket.handshake.query.roomID)
          .emit("updatedReadMessage", data.message_id);        
      });

      //disconnect the connection
      socket.on("disconnect", () => {
        console.log("user disconnect");
        socket.leave(socket.handshake.query.roomID);
        socket.disconnect();
      });

      //start lisntening event newChatMessage
      socket.on("newChatMessage", async (message) => {
        if (message.message_type !== "text") {
          req.utils = {
            handshake: socket.handshake.query.roomID,
            message: message,
          };
          socketImageUpload(req, res);
        } else {
          chat.message
            .create({
              chatRoom: message.chatRoom,
              message: message.content,
              from: from,
              to: message.to,
              message_type: "text",
            })
            .then(async (query) => {
              //populate the data with user profile data
              let sendMess = await query
                .populate("from", "name")
                .populate("to", "name")
                .execPopulate();

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
                .emit("messageErrorFromServer", "something wrong");
            });
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
}

async function socketImageUpload(req, res) {
  try {
    let from = mongoose.Types.ObjectId(req.profile.id);
    let fileName = crypto.randomBytes(16).toString("hex");
    const mimeArr = ["image/jpeg", "image/png", "image/gif", "image/bmp"];
    let mimeType = "";
    let contentType = "";
    let imageUrl = "";

    //get Mime Type
    mimeArr.forEach((item, i) => {
      if (req.utils.message.content.indexOf(item) > -1) {
        mimeType = item.split("/")[1];
        contentType = mimeArr[i];
      }
    });

    //if mime type not match return error
    if (mimeType == "") {
      req.io.to(req.utils.handshake).emit("messageErrorFromServer", {
        message: "file must be JPEG, GIF, PNG or BMP",
      });
    }
    // Set the AWS region
    const REGION = "ap-southeast-1"; //e.g. "us-east-1"

    // // Set the parameters.
    let imageBuffer = Buffer.from(
      req.utils.message.content.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const uploadParams = {
      ACL : "public-read",
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `images/chat/${fileName}.${mimeType}`,
      Body: imageBuffer,
      ContentEncoding: "base64",
      ContentType: contentType,
    };

    // Create Amazon S3 service client object.
    const s3 = new S3Client({
      region: REGION,
      credentials : {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      }      
    });
    

    // Create and upload the object to the specified Amazon S3 bucket.
    const run = async () => {
      try {
        const data = await s3.send(new PutObjectCommand(uploadParams));        
        return uploadParams.Key;
      } catch (err) {
        console.log("Error", err);
      }
    };
    imageUrl = await run();

    chat.message
      .create({
        chatRoom: req.utils.message.chatRoom,
        message: process.env.S3_URL+imageUrl,
        from: from,
        to: req.utils.message.to,
        message_type: "image",
      })
      .then(async (query) => {
        //populate the data with user profile data
        let sendMess = await query
          .populate("from", "name")
          .populate("to", "name")
          .execPopulate();

        //emit to specific room if message create message success
        req.io.to(req.utils.handshake).emit("messageFromServer", sendMess);
      })
      .catch((e) => {
        //emit to specific room if message create message error
        console.log(e);
        req.io
          .to(req.utils.handshake)
          .emit("messageFromServer", "something wrong");
      });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { startSocketChat, socketImageUpload };
