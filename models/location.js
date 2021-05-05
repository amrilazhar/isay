const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    city_type : {
      type : String,
      required : true,
    },
    city : {
      type : String,
      required : true,
    },
    province : {
      type : String,
      required : false,
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
