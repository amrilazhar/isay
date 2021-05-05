const mongoose = require("mongoose");
const { user, profile, interest, location } = require("../models");

class ProfileController {
  // view profile user
  async myProfile(req, res) {
    try {
      //find user id
      let dataProfile = await profile
        .findOne({ _id: req.params.id })
        .populate({
          path: "interest",
          select: "interest category",
        })
        .populate({
          path: "activities",
          select: "activities_type status_id comment_id timestamps",
        })
        .populate({
          path: "location",
          select: "province city_type city country",
        })
        .exec();
      return res.status(200).json({ message: "Success", data: dataProfile });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: e });
    }
  }

  //Update Profile
  async profileUpdate(req, res) {
    try {
      //for adding data interest and location
      let profileData = {
        bio: req.body.bio ? req.body.bio : "No description",
        name: req.body.name,
        avatar: req.body.avatar ? req.body.avatar : "defaultAvatar.jpg",
        user : req.body._id,
        activities: req.body.activities,
      };

      req.profileData.location = locations
      let locations = []
      locations = await location.findOne({_id: req.params.id})
      if(!locations) {
        return res.status(402).json({ message: "Location is not found"})
      } else {
      locations.push({_id: req.params.id});
      locations.save()};

      req.profileData.interest = interested
      let interested = []
      interested = await interest.findOne({_id: req.params.id})
      if(!interested){
        return res.status(402).json({ message: "interest is not found"})
      } else {
        locations.push({_id: req.params.id});
        locations.save()};

      let dataProfile = await profile.findOneAndUpdate(
        { _id: req.params.id },
        profileData,
        { new: true }
      );
      if (!dataProfile) {
        return res.status(402).json({ message: "Data user can't be appeared" });
      }
      return res.status(201).json({
        message: "Success",
        data: dataProfile,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e,
      });
    }
  }

  //delete Interest
  async deleteInterest(req, res) {
    try {
      let findUser = await user.findOne({ _id: req.user.id }); //id belum tahu
      let indexOfInterest = findUser.interest.indexOf(req.body.interest);
      if (indexOfInterest < 0) {
        return res
          .status(204)
          .json({ message: "Interest name has not been added at Interest" });
      } else {
        findUser.interest.splice(indexOfInterest, 1);
      }
      let deleteInterest = await user.findOneAndUpdate(
        { _id: findUser._id },
        findUser,
        { new: true }
      );
      if (!deleteInterest) {
        return res.status(204).json({ message: "Data user can't be appeared" });
      }
      let userInterest = deleteInterest.interest;
      if (userInterest == 0) {
        return res
          .status(204)
          .json({ message: "Interest is empty", data: deleteInterest });
      }
      return res
        .status(200)
        .json({ message: "delete interest success", data: deleteInterest });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Internal Server Error ", error: e });
    }
  }

}

module.exports = new ProfileController();
