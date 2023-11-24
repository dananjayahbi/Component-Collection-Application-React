const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newIdeaCategory = new Schema(
  {
    ideacategoryName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const IdeaCategories = mongoose.model("IdeaCategories", newIdeaCategory);

module.exports = IdeaCategories;
