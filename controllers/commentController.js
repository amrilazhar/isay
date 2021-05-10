const { profile, comment, post, status } = require("../models");

class CommentController {
  //===============================|| get all comment ||=========================//

  async getAllComment(req, res, next) {
    try {
      //cek paginate status
      let paginateStatus = true;
      if (req.query.pagination) {
        if (req.query.pagination == "false") {
          paginateStatus = false;
        }
      }
      const options = {
        page: 1,
        limit: 10,
        sort: { updated_at: -1 },
        pagination: paginateStatus,
      };

      let dataPost = await comment.find({}, options); //id profile

      if (dataPost.length == 0) {
        res.status(400).json({
          success: true,
          message: "No Posted found",
          data: null,
        });
      } else
        res.status(200).json({
          success: true,
          message: "Success",
          data: dataPost,
        });
    } catch (err) {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  //===============================|| create  comment ||=========================//
  async postComment(req, res, next) {
    try {
      // search status that I want to comment

      let ownerStatus = await status.findOne({ _id: req.params.id }); // id params post
      if (!ownerStatus) {
        const error = new Error("Status fail to be appeared");
        error.statusCode = 400;
        throw error;
      }

      let data = {
        content: req.body.content,
        media: req.body.media,
        owner: req.profile.id,
        comment: [],
      };

      let createComment = await comment.create(data);
      ownerStatus.comment.push(createComment._id);

      if (!createComment) {
        const error = new Error("Post Comment failed");
        error.statusCode = 400;
        throw error;
      } else
        res.status(200).json({
          success: true,
          message: "Post comment success",
          data: createComment,
        });
    } catch (err) {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  //===============================|| create  comment ||=========================//
  async postCommentAfterComment(req, res, next) {
    try {
      // search comment that I want to comment
      let ownerComment = await comment.findOne({ _id: req.params.id }); // params = id comment
      if (!ownerComment) {
        const error = new Error("Comment fail to be appeared");
        error.statusCode = 400;
        throw error;
      }

      let data = {
        content: req.body.content,
        media: req.body.media,
        owner: req.profile.id,
        comment: [],
      };

      let createComment = await comment.create(data);
      ownerComment.comment.push(createComment._id);

      if (!createComment) {
        const error = new Error("Post Comment failed");
        error.statusCode = 400;
        throw error;
      } else
        res.status(200).json({
          success: true,
          message: "Post comment Success",
          data: createComment,
        });
    } catch (err) {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  //===============================|| update comment ||=========================//

  async updateComment(req, res, next) {
    try {
      let data = {
        content: req.body.content,
        media: req.body.media,
      };

      let dataComment = await comment.findOneAndUpdate(
        { _id: req.params.id }, // id comment that will be changed
        data,
        { new: true }
      );
      if (!dataComment) {
        const error = new Error("Comment fail to be appeared");
        error.statusCode = 400;
        throw error;
      }

      res.status(200).json({
        success: true,
        message: "Update comment Success",
        data: dataComment,
      });
    } catch (err) {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  //===============================|| add like ||=========================//

  async addLike(req, res, next) {
    try {
      let findUser = await comment.findOne({ _id: req.query.id_comment });
      findUser.likeBy.push(req.profile.id);
      let insertUser = findUser.save();
      if (!insertUser) {
        const error = new Error("Can't like");
        error.statusCode = 400;
        throw error;
      } else
        res.status(200).json({
          success: true,
          message: "Success",
          data: findUser,
        });
    } catch (err) {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  //===============================|| add like ||=========================//

  async removeLike(req, res, next) {
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
        const error = new Error("Data User can't be appeared");
        error.statusCode = 400;
        throw error;
      } else
        res.status(200).json({
          success: true,
          message: "Success",
          data: deleteLike,
        });
      next();
    } catch (err) {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  //===============================|| delete comment ||=========================//

  async deleteComment(req, res) {
    try {
      let deleteCom = await comment.deleteOne({ _id: req.params.id }); //id comment that want to delete
      if (!deleteCom) {
        const error = new Error("Delete comment failed");
        error.statusCode = 400;
        throw error;
      } else
        res.status(200).json({
          success: true,
          message: "Delete comment Success",
          data: deleteCom.deletedCount,
        });
    } catch (err) {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
}

module.exports = new CommentController();
