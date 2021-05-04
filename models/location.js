const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    province : {
      type: String,
      required: true,
    },
    city_type : {
      type : String,
      required : true,
    },
    city : {
      type : String,
      required : true,
    },
    country : {
      type : String,
      required : true,
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("location", LocationSchema, "location");
