const LearningNode = require("../models/LearningNodes.model");

// Function to generate a random LID
function generateRandomLID() {
  const prefix = "L"; // First letters
  const length = 10; // Total length of the LID
  const digits = "0123456789"; // Allowed digits

  let lid = prefix;

  for (let i = 0; i < length - prefix.length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    lid += digits[randomIndex];
  }

  return lid;
}

// Add LearningNode
const addLearningNode = async (req, res) => {
  const { title, sections } = req.body;

  let existingLearningNode;
  let learningNode;
  let lid; // Declare lid variable outside of the loop

  do {
    lid = generateRandomLID(); // Assign the generated LID
    existingLearningNode = await LearningNode.findOne({
      LID: lid,
    });
  } while (existingLearningNode);

  learningNode = await LearningNode.create({
    LID: lid,
    title,
    sections,
  });

  if (learningNode) {
    res.status(200);
    res.json("LearningNode added");
  } else {
    res.status(400);
    res.json("Adding LearningNode failed");
  }
};

//Get All LearningNode
const getAllLearningNode = async (req, res) => {
  const abc = await LearningNode.find()
    .then((learningNode) => {
      res.json(learningNode);
    })
    .catch((e) => {
      console.log(e);
    });
};

//Get a LearningNode
const getLearningNode = async (req, res) => {
  try {
    const learningNodeObject = await LearningNode.findById(req.params.id);

    if (!learningNodeObject) {
      return res.status(404).json({ error: "LearningNode not found" });
    }

    const { _id, LID: lid, title, sections } = learningNodeObject;

    res.status(200).json({
      _id,
      LID: lid,
      title,
      sections,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//Update LearningNode
const updateLearningNode = async (req, res) => {
  try {
    const { title, sections } = req.body;

    let updateData = {
      title,
      sections,
    };

    // Updating
    const update = await LearningNode.findByIdAndUpdate(
      req.params.id,
      updateData
    );

    if (update) {
      res.status(200).json({
        data: "LearningNode updated successfully",
        status: true,
      });
    } else {
      res.status(401).json({
        errorMessage: "Failed to edit the LearningNode!",
        status: false,
      });
    }
  } catch (error) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + error,
      status: false,
    });
  }
};

//Delete LearningNode
const deleteLearningNode = async (req, res) => {
  try {
    const deleted = await LearningNode.findByIdAndDelete(req.params.id);

    if (deleted) {
      res.status(200).json({
        data: "LearningNode Deleted",
        status: true,
      });
    } else {
      res.status(401).json({
        errrorMessage: "Failed to delete the LearningNode!",
        status: false,
      });
    }
  } catch (error) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + error,
      status: false,
    });
  }
};

//Export
module.exports = {
  addLearningNode,
  getAllLearningNode,
  getLearningNode,
  updateLearningNode,
  deleteLearningNode,
};
