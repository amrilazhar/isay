const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const StatusSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "profile",
    },
    media: {
      type: Array,
      required: false,
    },
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
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

InterestSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("status", StatusSchema, "status");
