const mongoose = require("mongoose");

const InterestSchema = new mongoose.Schema(
  {
    interest : {
      type: String,
      required: true,
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("interest", InterestSchema, "interest");
