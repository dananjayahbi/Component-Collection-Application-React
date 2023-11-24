const CPIdeas = require("../models/CPIdeas.model");

// Add Idea
const addIdea = async (req, res) => {
  const { imageURL, category} = req.body;

  // Check if tax with the same image already exists
  const existingURL = await CPIdeas.findOne({
    $or: [{ imageURL: imageURL }],
  });
  if (existingURL) {
    return res
      .status(400)
      .json({ error: "A image with the same URL already exists" });
  }

  const url = await CPIdeas.create({
    imageURL,
    category,
  });

  if (url) {
    res.status(200);
    res.json("Image added");
  } else {
    res.status(400);
    res.json("Adding Image failed");
  }
};

//Get All CPIdeas
const getAllCPIdeas = async (req, res) => {
  const abc = await CPIdeas.find()
    .then((url) => {
      res.json(url);
    })
    .catch((e) => {
      console.log(e);
    });
};

//Get a CPIdea
const getCPIdea= async (req, res) => {
  try {
    const ideaObject = await CPIdeas.findById(req.params.id);

    if (!ideaObject) {
      return res.status(404).json({ error: "CPIdea not found" });
    }

    const { _id, imageURL, category } = ideaObject;

    res.status(200).json({
      _id,
      imageURL,
      category,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//Update CPIdea
const updateCPIdea = async (req, res) => {
  try {
    const { imageURL, category } = req.body;

    let updateData = {
      imageURL,
      category,
    };

    // Updating
    const update = await CPIdeas.findByIdAndUpdate(
      req.params.id,
      updateData
    );

    if (update) {
      res.status(200).json({
        data: "Image URL updated successfully",
        status: true,
      });
    } else {
      res.status(401).json({
        errorMessage: "Failed to edit the Image URL!",
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

//Delete CPIdea
const deleteCPIdea = async (req, res) => {
  try {
    const deleted = await CPIdeas.findByIdAndDelete(req.params.id);

    if (deleted) {
      res.status(200).json({
        data: "CPIdea Deleted",
        status: true,
      });
    } else {
      res.status(401).json({
        errrorMessage: "Failed to delete the CPIdea!",
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
  addIdea,
  getAllCPIdeas,
  getCPIdea,
  updateCPIdea,
  deleteCPIdea,
};
