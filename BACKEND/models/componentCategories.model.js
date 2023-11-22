const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newCategory = new Schema(
  {
    categoryName: {
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

const Categories = mongoose.model("Categories", newCategory);

module.exports = Categories;
