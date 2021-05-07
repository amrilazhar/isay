const mongoose = require("mongoose");
const { status, profile, interest, location, activities } = require("../models");

class ProfileController {
//=====================|| my profile ||=================//
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
          path: "location",
          select: "province city_type city country",
        })
        .exec();
      // req.io.emit("my profile:" + dataProfile, dataProfile);

      return res.status(200).json({ message: "Success", data: dataProfile });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: e });
    }
  }


//=====================|| my profile post ||=================//
  async myProfilePost(req, res) {
    try {
      let paginateStatus = true;
      if (req.query.pagination) {
        if (req.query.pagination == "false") {
          paginateStatus = false;
        }
      }
      
      const options = {
        select: "content media comment likeBy",
        sort: { updated_at: -1 },
        page: 1,
        limit: 5,
        pagination: paginateStatus,
      };

      let dataProfile = await status.paginate(
         { profile_id : req.query.id } ,
        options
      );
      // req.io.emit("my profile's post:" + dataProfile, dataProfile);
      return res.status(200).json({ message: "Success", data: dataProfile });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: e });
    }
  }
//======================|| my profile activity ||====================//

  async myProfileActivities(req, res) {
    try {
      let paginateStatus = true;
      if (req.query.pagination) {
        if (req.query.pagination == "false") {
          paginateStatus = false;
        }
      }
      
      const options = {
        select: "status_id activities_type comment_id",
        sort: { updated_at: -1 },
        page: 1,
        populate: { path: "status_id", select: "content media comment likeBy" },
        limit: 5,
        pagination: paginateStatus,
      };

      let dataProfile = await activities.paginate(
        {  profile_id : req.query.id },
        options
      );
      // req.io.emit("my profile's activities:" + dataProfile, dataProfile);
      return res.status(200).json({ message: "Success", data: dataProfile });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: e });
    }
  }



  // =======================|| Update Profile ||================//
  async profileUpdate(req, res) {
    try {

      let profileData = {
        bio: req.body.bio ? req.body.bio : "No description",
        name: req.body.name,
        avatar: req.body.avatar ? req.body.avatar : "defaultAvatar.jpg",
        user : req.body._id,
        activities: req.body.activities,
      };

      let dataProfile = await profile.findOneAndUpdate(
        { _id: req.params.id },
        profileData,
        { new: true }
      );
      if (!dataProfile) {
        return res.status(402).json({ message: "Data user can't be appeared" });
      }
      // req.io.emit("my profile update:" + dataProfile, dataProfile);
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

  //===========================|| add location ||========================//

  async addLocation(req, res) {
    try {
      let findUser = await profile.findOne({ _id: req.params.id });
      findUser.location.push(req.location._id);
      let insertUser = findUser.save();
      if (!insertUser) {
        return res.status(402).json({ message: "Location can't added" });
      } else
       res.status(200).json({ message: "Location added success", data: findUser })//.likeBy.sort({ name : -1 } ).limit(5) });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

   //===========================|| add Interest ||========================//

   async addInterest(req, res) {
    try {
      let findUser = await profile.findOne({ _id: req.params.id });
      findUser.interest.push(req.interest._id);
      let insertUser = findUser.save();
      if (!insertUser) {
        return res.status(402).json({ message: "Interest can't added" });
      } else
       res.status(200).json({ message: "Interest added success", data: findUser })//.likeBy.sort({ name : -1 } ).limit(5) });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }


  //===========================|| delete Interest ||========================//
  async deleteInterest(req, res) {
    try {
      let findUser = await profile.findOne({ _id: req.params.id }); //id belum tahu
      let indexOfInterest = findUser.interest.indexOf(req.body.interest);
      if (indexOfInterest < 0) {
        return res
          .status(204)
          .json({ message: "Interest name has not been added at Interest" });
      } else {
        findUser.interest.splice(indexOfInterest, 1);
      }
      let deleteInterest = await profile.findOneAndUpdate(
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

    //===========================|| delete location ||========================//
    async deleteLocation(req, res) {
      try {
        let findUser = await profile.findOne({ _id: req.params.id }); //id belum tahu
        let indexOfLocation = findUser.location.indexOf(req.body.location);
        if (indexOfLocation < 0) {
          return res
            .status(204)
            .json({ message: "location name has not been added at Interest" });
        } else {
          findUser.location.splice(indexOfLocation, 1);
        }
        let deletelocation = await profile.findOneAndUpdate(
          { _id: findUser._id },
          findUser,
          { new: true }
        );
        if (!deletelocation) {
          return res.status(204).json({ message: "Data user can't be appeared" });
        }

        return res
          .status(200)
          .json({ message: "delete location success", data: deletelocation });
      } catch (e) {
        console.log(e);
        return res
          .status(500)
          .json({ message: "Internal Server Error ", error: e });
      }
    }
}

module.exports = new ProfileController();
