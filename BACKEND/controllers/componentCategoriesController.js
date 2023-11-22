const Categories = require("../models/componentCategories.model");

// Add Category
const addCategory = async (req, res) => {
  const { categoryName, description } = req.body;

  // Check if tax with the same category already exists
  const existingCateg = await Categories.findOne({
    $or: [{ categoryName: categoryName }],
  });
  if (existingCateg) {
    return res
      .status(400)
      .json({ error: "A FP Category with the same name already exists" });
  }

  const category = await Categories.create({
    categoryName,
    description,
  });

  if (category) {
    res.status(200);
    res.json("Category added");
  } else {
    res.status(400);
    res.json("Adding Category failed");
  }
};

//Get All Categories
const getAllCategories = async (req, res) => {
  const abc = await Categories.find()
    .then((categ) => {
      res.json(categ);
    })
    .catch((e) => {
      console.log(e);
    });
};

//Get a Category
const getCategory = async (req, res) => {
  try {
    const categoryObject = await Categories.findById(req.params.id);

    if (!categoryObject) {
      return res.status(404).json({ error: "Category not found" });
    }

    const { _id, categoryName, description } = categoryObject;

    res.status(200).json({
      _id,
      categoryName,
      description,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//Update FP Category
const updateCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;

    let updateData = {
      categoryName,
      description,
    };

    // Updating
    const update = await Categories.findByIdAndUpdate(
      req.params.id,
      updateData
    );

    if (update) {
      res.status(200).json({
        data: "Category updated successfully",
        status: true,
      });
    } else {
      res.status(401).json({
        errorMessage: "Failed to edit the Category!",
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

//Delete Category
const deleteCategory = async (req, res) => {
  try {
    const deleted = await Categories.findByIdAndDelete(req.params.id);

    if (deleted) {
      res.status(200).json({
        data: "Category Deleted",
        status: true,
      });
    } else {
      res.status(401).json({
        errrorMessage: "Failed to delete the Category!",
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
  addCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
