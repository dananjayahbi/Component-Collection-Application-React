const router = require("express").Router();

const {
  addideaCategory,
  getAllideaCategories,
  getideaCategory,
  updateideaCategory,
  deleteideaCategory,
} = require("../controllers/CPIdeaCategoryController");

//ADD NEW  ideaCATEGORY
router.post("/addideaCategory", addideaCategory);

//GET ALL  CATEGORIES
router.get("/getAllideaCategories", getAllideaCategories);

//GET  ideaCATEGORY
router.get("/getideaCategory/:id", getideaCategory);

//UPDATE  ideaCATEGORY
router.put("/updateideaCategory/:id", updateideaCategory);

//DELETE  ideaCATEGORY
router.delete("/deleteideaCategory/:id", deleteideaCategory);

module.exports = router;
