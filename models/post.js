const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const PostSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: false,
    },
    media: {
      type: Array,
      required: false,
    },
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "comment",
      },
    ],
    likeBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "profile",
        },
      ]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

PostSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("post", PostSchema, "post");
