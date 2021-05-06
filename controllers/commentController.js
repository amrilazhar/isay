const { profile, comment, post } = require("../models");

class CommentController {
  //=============================== get all comment =========================//

  async getAllComment(req, res) {
    try {
      let dataPost = await comment.find({ _id: req.params.id })  

      if (dataPost.length == 0) {
        return res.status(400).json({ message: "No Posted found", data: null });
      } else
        return res
          .status(200)
          .json({
            message: "Success",
            data: dataPost,
          });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Internal server error", error: e });
    }
  }

  //=============================== create  comment =========================//
  async postComment(req, res) {
    try {
      // search status that I want to comment
      // params = post id
      let ownerComment = await status.findOne({_id: req.params.id});

      let data = {
        content: req.body.content,
        media: req.body.media ? req.body.media : "images.jpg",
        owner: req.profile.id,
        child: [],
      };

      let createComment = await comment.create(data);
      ownerComment.child.push(createComment._id).save()

      if (!createComment) {
        return res
          .status(400)
          .json({ message: "Post Comment failed", error: createComment });
      } else
        return res
          .status(200)
          .json({ message: "Success", data: ownerComment });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Internal server error", error: e });
    }
  }

    //=============================== create  comment =========================//
    async postCommentafterComment(req, res) {
      try {
        // search comment that I want to comment
        // params = comment id
        let ownerComment = await comment.findOne({ _id: req.params.id})
        if (!ownerComment) {
          return res
            .status(400)
            .json({ message: " Comment fail to be appeared", error: ownerComment });
        }

        let data = {
          content: req.body.content,
          media: req.body.media ? req.body.media : "images.jpg",
          owner: req.profile.id,
          child: [],
        };
  
        let createComment = await comment.create(data);
        ownerComment.child.push( createComment._id ).save()
  
        if (!createComment) {
          return res
            .status(400)
            .json({ message: "Post Comment failed", error: createComment });
        } else
          return res
            .status(200)
            .json({ message: "Success", data: createComment });
      } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error", error: e });
      }
    }
  //=============================== update comment =========================//

  async updateComment(req, res) {
    try {
      let data = {
        content: req.body.content,
        media: req.body.media ? req.body.media : "images.jpg",
        comment: req.body.comment,
      };

      let dataComment = await comment.findOneAndUpdate(
        { _id: req.params.id }, // id comment that will be changed
        data,
        { new: true }
      );
      if (!dataComment) {
        return res
          .status(402)
          .json({ message: "Comment data can't be appeared" });
      }
      req.io.emit("comment:" + dataComment._id, dataComment);
      return res.status(201).json({
        message: "Success",
        data: dataComment,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e,
      });
    }
  }

  //=============================== add like =========================//

  async addLike(req, res) {
    try {
      let findUser = await comment.findOne({ _id: req.query.id_comment });
      findUser.likeBy.push(req.profile.id);
      let insertUser = findUser.save();
      if (!insertUser) {
        return res.status(402).json({ message: "Can't like" });
      } else
       res.status(200).json({ message: "like success", data: findUser })//.likeBy.sort({ name : -1 } ).limit(5) });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  //=============================== add like =========================//

  async removeLike(req, res) {
    try {
      let findUser = await comment.findOne({ _id: req.query.id_comment });
      let indexOfLike = findUser.likeBy.indexOf(req.profile.id);
      findUser.likeBy.splice(indexOfLike, 1);
      let deleteLike = await comment.findOneAndUpdate(
        { _id: findUser._id },
        findUser,
        { new: true }
      );
      if (!insertUser) {
        return res.status(402).json({ message: "Data user can't be appeared" });
      } else
        res.status(200).json({ message: "remove like success", data: deleteLike });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  //=============================== delete comment =========================//

  async deleteComment(req, res) {
    try {
      let deleteCom = await comment.deleteOne({ _id: req.params.id });

      if (!deleteCom.deletedCount) {
        return res
          .status(400)
          .json({ message: "Delete comment failed", error: deleteCom });
      } else
      req.io.emit("comment:" + deleteCom._id, deleteCom.deletedCount)
        return res
          .status(200)
          .json({ message: "Success", deletedCount: deleteCom.deletedCount });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal server error", error: e });
    }
  }
}

module.exports = new CommentController();
