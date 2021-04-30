const { user, profile, interest } = require("../models");

class ProfileController {
  // view profile user
  async myUserProfile(req, res) {
    try {
      //find user id
      let dataUser = await user.findOne(
        /*{ _id: req.profile.id} || */ { name: req.profile.name }
      );
      return res.status(200).json({ message: "Success", data: dataUser });
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
      // Update data
      if (req.user.id != req.params.id) {
        // id nya masih gatau
        return res.status(204).json({ message: "Id User is not found" });
      }
      let dataUser = await user.findOneAndUpdate(
        { _id: req.params.id }, //id nya masih gatau
        req.body,
        { new: true }
      );
      // If success
      if (!dataUser) {
        return res
          .status(404)
          .json({ message: "Id User is not found", error: e });
      }
      return res.status(200).json({ message: "Success", data: dataUser });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: e });
    }
  }

  //add Interest
  async addInterest(req, res) {
    try {
      let findUser = await user.findOne({ _id: req.user.id }); //id masih gatau
      findUser.interest.push(req.body.interest);
      let insertUser = await user.findOneAndUpdate(
        { _id: findUser._id },
        findUser,
        { new: true }
      );
      if (!insertUser) {
        return res
          .status(204)
          .json({ message: "Data user can't be appeared", error: e });
      } else
        res
          .status(200)
          .json({ message: "Add interest success", data: insertUser });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: e });
    }
  }

  //delete watchlist
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
        return res.status(204).json({ message: "Interest is empty", data: deleteInterest});
      }
      res
        .status(200)
        .json({ message: "delete interest success", data: deleteInterest });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Internal Server Error " });
    }
  }
}

module.exports = new ProfileController();
