const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: false,
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "profile",
    },
    likeBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "profile",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

InterestSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("comment", CommentSchema, "comment");

