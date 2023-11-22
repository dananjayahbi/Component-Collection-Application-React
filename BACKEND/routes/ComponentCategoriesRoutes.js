const router = require("express").Router();

const {
  addCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/componentCategoriesController");

//ADD NEW  CATEGORY
router.post("/addCategory", addCategory);

//GET ALL  CATEGORIES
router.get("/getAllCategories", getAllCategories);

//GET  CATEGORY
router.get("/getCategory/:id", getCategory);

//UPDATE  CATEGORY
router.put("/updateCategory/:id", updateCategory);

//DELETE  CATEGORY
router.delete("/deleteCategory/:id", deleteCategory);

module.exports = router;
