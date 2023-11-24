const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newIdea = new Schema(
  {
    imageURL: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CPIdeas = mongoose.model("CPIdeas", newIdea);

module.exports = CPIdeas;
