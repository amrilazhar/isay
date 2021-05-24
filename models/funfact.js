const mongoose = require("mongoose");

const FunFactSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    interest: {
      type: String,
      required: true,
      ref: "interest",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("funfact", FunFactSchema, "funfact");
