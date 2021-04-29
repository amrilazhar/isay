const { interest, location } = require("../models");

class UtilsController {
  async getAllLocation(req, res) {
    try {
      //get data from database
      let dataLoc = await location.find().exec();

      //check if data empty
      if (!dataLoc) return res.status(400).json({ message: "data empty" });

      //send data
      return res.status(200).json({ message: "success", data: dataLoc });
    } catch (error) {
      return res.status(500).json({ message: "internal server error" });
    }
  }

  async getInterest(req, res) {
    try {
      // set category to all or to specific
      let category =
        req.params.category.toLowerCase() === "all"
          ? {}
          : { category: req.params.category };
      //get data from database
      let dataLoc = await interest.find(category).exec();

      //check if data empty
      if (!dataLoc) return res.status(400).json({ message: "data empty" });

      //send data
      return res.status(200).json({ message: "success", data: dataLoc });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "internal server error" });
    }
  }
}

module.exports = new UtilsController();
