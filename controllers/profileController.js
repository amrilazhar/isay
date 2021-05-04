const { user, profile, interest, location } = require("../models");

class ProfileController {
  // view profile user
  async myProfile(req, res) {
    try {
      //find user id
      let dataProfile = await profile
        .findOne({ _id: req.params.id })
        .populate({
          path: "post",
          select: "content media comment likeBy",
        })
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
      let interested = [];
      if (typeof req.body.interest == "string") {
        req.body.interest = [req.body.interest];
      }
      if (req.interest) {
        for (let i = 0; i < req.category.length; i++) {
          interested.push({
            interest: req.body.interest[i],
            category: req.body.category[i]
          });
        }
      }

      let locations = [];
      if (typeof req.body.location == "string") {
        req.body.location = [req.body.location];
      }
      if (req.location) {
        for (let i = 0; i < req.location.length; i++) {
          locations.push({
            location: req.body.location[i]
          });
        }
      }


      let profileData = {
        bio: req.body.bio ? req.body.bio : "No description",
        name: req.body.name,
        interest: interested,
        avatar: req.body.avatar ? req.body.avatar : "defaultAvatar.jpg",
        user : req.user.id,
        location: []
      };

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
