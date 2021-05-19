const { notification } = require("../models");

class NotificationController {
  async getNotifHistory(req, res, next) {
    try {
      //get data from database
      let dataNotif = await notification.find({ owner: req.profile.id }).exec();

      //send data
      return res.status(200).json({
        success: true,
        message: "success",
        data: dataNotif,
        count: dataNotif.length,
      });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }

  async setReadStatus(req, res, next) {
    try {
      //get data from database
      let setRead = await notification.findOneAndUpdate(
        { _id: req.profile.id },
        { readed: true },
        { new: true }
      );

      if (setRead) {
        return res.status(200).json({ success: true, message: "readed" });
      }
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
}

module.exports = new NotificationController();
