const { profile, comment, post } = require("../models");

class CommentController {
  //===============================|| get all comment ||=========================//

  async getAllComment(req, res) {
    try {
      let dataPost = await comment.find({ _id: req.params.id })  //id profile 

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

  //===============================|| create  comment ||=========================//
  async postComment(req, res, next) {
    try {
      // search status that I want to comment
      
      let ownerStatus = await status.findOne({_id: req.params.id});   // id params post 
      if (!ownerComment) {
        return res
          .status(400)
          .json({ message: " Status fail to be appeared", error: ownerComment });
      }

      let data = {
        content: req.body.content,
        media: req.body.media,
        owner: req.profile.id,
        child: [],
      };

      let createComment = await comment.create(data);
      ownerStatus.comment.push(createComment._id).save()

      if (!createComment) {
        return res
          .status(400)
          .json({ message: "Post Comment failed", error: createStatus });
      } else
        res
          .status(200)
          .json({ message: "Success", data: ownerComment });

          next()
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Internal server error", error: e });
    }
  }

    //===============================|| create  comment ||=========================//
    async postCommentAfterComment(req, res, next) {
      try {
        // search comment that I want to comment
        let ownerComment = await comment.findOne({ _id: req.params.id}) // params = id comment
        if (!ownerComment) {
          return res
            .status(400)
            .json({ message: " Comment fail to be appeared", error: ownerComment });
        }

        let data = {
          content: req.body.content,
          media: req.body.media,
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
          res
            .status(200)
            .json({ message: "Success", data: createComment });

            next()
      } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error", error: e });
      }
    }
  //===============================|| update comment ||=========================//

  async updateComment(req, res, next) {
    try {
      let data = {
        content: req.body.content,
        media: req.body.media,
        owner: req.profile.id,
        child: [],
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

      res.status(200).json({
        message: "Success",
        data: dataComment,
      });

      next()
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e,
      });
    }
  }

  //===============================|| add like ||=========================//

  async addLike(req, res) {
    try {
      let findUser = await comment.findOne({ _id: req.query.id_comment });
      findUser.likeBy.push(req.profile.id);
      let insertUser = findUser.save();
      if (!insertUser) {
        return res.status(402).json({ message: "Can't like" });
      } else
       res.status(200).json({ message: "like success", data: findUser })
      next()
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  //===============================|| add like ||=========================//

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
        next()
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  //===============================|| delete comment ||=========================//

  async deleteComment(req, res) {
    try {
      let deleteCom = await comment.deleteOne({ _id: req.params.id }); //id comment that want to delete
      if (!deleteCom.deletedCount) {
        return res
          .status(400)
          .json({ message: "Delete comment failed", error: deleteCom });
      } else
         res
          .status(200)
          .json({ message: "Success", deletedCount: deleteCom.deletedCount });

          next()
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Internal server error", error: e });
    }
  }
}

module.exports = new CommentController();
