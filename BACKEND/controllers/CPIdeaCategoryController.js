const IdeaCategories = require("../models/CPIdeaCategory.model");

// Add ideaCategory
const addideaCategory = async (req, res) => {
  const { ideacategoryName, description } = req.body;

  // Check if tax with the same ideacategory already exists
  const existingCateg = await IdeaCategories.findOne({
    $or: [{ ideacategoryName: ideacategoryName }],
  });
  if (existingCateg) {
    return res
      .status(400)
      .json({ error: "A FP ideaCategory with the same name already exists" });
  }

  const ideacategory = await IdeaCategories.create({
    ideacategoryName,
    description,
  });

  if (ideacategory) {
    res.status(200);
    res.json("ideaCategory added");
  } else {
    res.status(400);
    res.json("Adding ideaCategory failed");
  }
};

//Get All Categories
const getAllideaCategories = async (req, res) => {
  const abc = await IdeaCategories.find()
    .then((categ) => {
      res.json(categ);
    })
    .catch((e) => {
      console.log(e);
    });
};

//Get a ideaCategory
const getideaCategory = async (req, res) => {
  try {
    const ideacategoryObject = await IdeaCategories.findById(req.params.id);

    if (!ideacategoryObject) {
      return res.status(404).json({ error: "ideaCategory not found" });
    }

    const { _id, ideacategoryName, description } = ideacategoryObject;

    res.status(200).json({
      _id,
      ideacategoryName,
      description,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//Update FP ideaCategory
const updateideaCategory = async (req, res) => {
  try {
    const { ideacategoryName, description } = req.body;

    let updateData = {
      ideacategoryName,
      description,
    };

    // Updating
    const update = await IdeaCategories.findByIdAndUpdate(
      req.params.id,
      updateData
    );

    if (update) {
      res.status(200).json({
        data: "ideaCategory updated successfully",
        status: true,
      });
    } else {
      res.status(401).json({
        errorMessage: "Failed to edit the ideaCategory!",
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

//Delete ideaCategory
const deleteideaCategory = async (req, res) => {
  try {
    const deleted = await IdeaCategories.findByIdAndDelete(req.params.id);

    if (deleted) {
      res.status(200).json({
        data: "ideaCategory Deleted",
        status: true,
      });
    } else {
      res.status(401).json({
        errrorMessage: "Failed to delete the ideaCategory!",
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
  addideaCategory,
  getAllideaCategories,
  getideaCategory,
  updateideaCategory,
  deleteideaCategory,
};
