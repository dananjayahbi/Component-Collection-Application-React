const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newOtherCode = new Schema(
  {
    OTID: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    imageURLs: [
      {
        imgURL: String,
      }
    ]
  },
  {
    timestamps: true,
  }
);

const OtherCodes = mongoose.model("OtherCodes", newOtherCode);

module.exports = OtherCodes;
