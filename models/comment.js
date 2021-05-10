const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: false,
    },
    media: {
      type: Array,
      required: false,
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
    comment : [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "comment"
      }
    ]
  }, 
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);



CommentSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("comment", CommentSchema, "comment");

