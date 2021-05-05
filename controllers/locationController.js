const mongoose = require("mongoose");
const { location } = require("../models");

class locationController {
    //=============================== get all location ==================//
    async getAllLocation(req, res) {
      try {
        let dataLocation = await location.find().exec()
        //cek if data exist
        if (dataLocation.length == 0) {
          return res.status(400).json({ message: "No location found", data: null });
        } else
          return res.status(200).json({ message: "Success", data: dataLocation});
      } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal server error" ,error: e });
      }
    }

//=============================== create all location =========================//
    async createLocation(req, res) {
        try {
          let data = {
            province : req.body.province,
            city_type : req.body.city_type,
            city : req.body.city,
            country : req.body.country
          };
          let createLocation = await location.create(data);
          if (!createLocation) {
            return res
              .status(400)
              .json({ message: "Insert location failed", error: createLocation });
          } else
            return res.status(200).json({ message: "Success", data: createLocation });
        } catch (e) {
          console.log(e);
          res.status(500).json({ message: "Internal server error" , error: e});
        }
      }

       
//============================= update location ===========================================//

async updateLocation(req, res) {
  try {
    let data = {
      province : req.body.province,
      city_type : req.body.city_type,
      city : req.body.city,
      country : req.body.country
    };

    let updateLoc = await location.findOneAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );

    if (!updateLoc) {
      return res
        .status(400)
        .json({ message: "Update location failed", error: updateLoc });
    } else
      return res.status(200).json({ message: "Success", data: updateLoc });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error", error : e});
  }
}

//============================ delete location ====================//

async deleteLocation(req, res) {
  try {
    let deleteLoc = await location.deleteOne({ _id: req.params.id });

    if (!deleteLoc.deletedCount) {
      return res
        .status(400)
        .json({ message: "Delete location failed", error: deleteLoc });
    } else
      return res
        .status(200)
        .json({ message: "Success", deletedCount: deleteLoc.deletedCount });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" , error : e});
  }
}
}

module.exports = new locationController();
