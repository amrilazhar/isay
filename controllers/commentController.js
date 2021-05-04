const { profile, comment, post } = require("../models");

class CommentController {
  async getAllPost(req, res) {
    try {
      let dataPost = await post.find().exec();
      if (dataPost.length == 0) {
        return res.status(400).json({ message: "No Posted found", data: null });
      } else
        return res.status(200).json({ message: "Success", data: dataPost });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal server error", error: e });
    }
  }

  //=============================== create  post =========================//
  async postCreate(req, res) {
    try {
      let data = {
        content: req.body.content,
        media: req.body.media ? req.body.media : "images.jpg",
        comment: req.body.comment,
        likeBy: req.body.likey,
      };
      let createPost = await post.create(data);
      if (!createPost) {
        return res
          .status(400)
          .json({ message: "Post Status failed", error: createPost });
      } else
        return res.status(200).json({ message: "Success", data: createPost });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal server error", error: e });
    }
  }
  //=============================== create  comment =========================//
  async postComment(req, res) {
    try {
      let data = {
        content: req.body.content,
        media: req.body.media ? req.body.media : "images.jpg",
        comment: req.body.comment,
        likeBy: req.body.likey,
      };
      let createComment = await comment.create(data);
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
      res.status(500).json({ message: "Internal server error", error: e });
    }
  }

  //=============================== create post =========================//

  async updatePost(req, res) {
    try {
      let data = {
        content: req.body.content,
        media: req.body.media ? req.body.media : "images.jpg",
        comment: req.body.comment,
        likeBy: req.body.likeBy,
      };

      let dataPost = await post.findOneAndUpdate({ _id: req.params.id }, data, {
        new: true,
      });
      if (!dataPost) {
        return res.status(402).json({ message: "Post Data can't be appeared" });
      }
      return res.status(201).json({
        message: "Success",
        data: dataPost,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e,
      });
    }
  }

//======================== post like =======================//
  async postLike(req, res) {
    try {
      let likesbutton = await post.findById(
        req.params.id,
        function (err, theUser) {
          if (err) {
            console.log(err);
          } else {
            theUser.likes += 1;
            theUser.save();
            console.log(theUser.likes);
            return res.send({ likeCount: theUser.likes });
          }
        }
      );
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e,
      });
    }
  }

  //=============================== update comment =========================//

  async updateComment(req, res) {
    try {
      let data = {
        content: req.body.content,
        media: req.body.media ? req.body.media : "images.jpg",
        comment: req.body.comment,
        likeBy: req.body.likeBy,
      };

      let dataComment = await comment.findOneAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );
      if (!dataComment) {
        return res
          .status(402)
          .json({ message: "Comment data can't be appeared" });
      }
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

  //=============================== delete status =========================//

  async deletePost(req, res) {
    try {
      let deletePost = await post.deleteOne({ _id: req.params.id });

      if (!deletePost.deletedCount) {
        return res
          .status(400)
          .json({ message: "Delete post failed", error: deletePost });
      } else
        return res
          .status(200)
          .json({ message: "Success", deletedCount: deletePost.deletedCount });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal server error", error: e });
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
