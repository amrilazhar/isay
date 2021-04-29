const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const ActivitiesSchema = new mongoose.Schema(
  {
    activities_type: {
      type: String,
      required: false,
    },
    status_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "status",
    },
    comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "comment",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref : "profile"
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

ActivitiesSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("activities", ActivitiesSchema, "activities");
