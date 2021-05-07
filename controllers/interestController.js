const mongoose = require("mongoose");
const { interest } = require("../models");
class interestController {
    //=============================== get all interest ==================//
    async getAllInterest(req, res) {
      try {
        //get data genre
        let dataInterest = await interest.find().exec()
        //cek if data exist
        if (dataInterest.length == 0) {
          return res.status(400).json({ message: "No interest found", data: null });
        } else
          return res.status(200).json({ message: "Success", data: dataInterest });
      } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" ,error: e });
      }
    }

//=============================== create all interest and category==================//
    async createInterest(req, res) {
        try {
          let data = {
            interest: req.body.interest,
            category: req.body.category
          };
          let createInterest = await interest.create(data);
    
          if (!createInterest) {
            return res
              .status(400)
              .json({ message: "Insert interest failed", error: createGen });
          } else
            return res.status(200).json({ message: "Success", data: createInterest });
        } catch (e) {
          console.log(e);
          return res.status(500).json({ message: "Internal server error" , error: e});
        }
      }

//============================= update interest and category =========================//

async updateInterest(req, res) {
  try {
    let data = {
      interest: req.body.interest,
      category: req.body.category
    };

    let updateInt = await interest.findOneAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );

    if (!updateInt) {
      return res
        .status(400)
        .json({ message: "Update interest failed", error: updateInt });
    } else
      return res.status(200).json({ message: "Success", data: updateInt });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error", error : e});
  }
}

//============================ delete Interest ================//

async deleteInterest(req, res) {
  try {
    let deleteInt = await interest.deleteOne({ _id: req.params.id });

    if (!deleteInt.deletedCount) {
      return res
        .status(400)
        .json({ message: "Delete interest failed", error: deleteInt });
    } else
      return res
        .status(200)
        .json({ message: "Success", deletedCount: deleteInt.deletedCount });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" , error : e});
  }
}
}

module.exports = new interestController();
