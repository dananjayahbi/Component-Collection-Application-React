const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newLearningNode = new Schema(
  {
    LID: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    sections: [
      {
        title: String,
        note: String,
        imageURLs: [
          {
            imgURL: String,
          },
        ],
        codes: [
          {
            language: String,
            title: String,
            code: String,
            notes: String,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const LearningNode = mongoose.model("LearningNode", newLearningNode);

module.exports = LearningNode;
