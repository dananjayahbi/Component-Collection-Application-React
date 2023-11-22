const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newComponent = new Schema(
  {
    CID: {
      type: String,
      required: true,
    },
    componentName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    mainTechnology: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
    },
    description: {
      type: String,
    },
    notes: {
      type: String,
    },
    codes: [
      {
        language: String,
        code: String,
        notes: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Components = mongoose.model("Components", newComponent);

module.exports = Components;
