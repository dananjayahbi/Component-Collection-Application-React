const router = require("express").Router();

const {
  addLearningNode,
  getAllLearningNode,
  getLearningNode,
  updateLearningNode,
  deleteLearningNode,
} = require("../controllers/learningNodesController");

//ADD NEW OTHERCODE
router.post("/addLearningNode", addLearningNode);

//GET ALL OTHERCODES
router.get("/getAllLearningNode", getAllLearningNode);

//GET OTHERCODE
router.get("/getLearningNode/:id", getLearningNode);

//UPDATE OTHERCODE
router.put("/updateLearningNode/:id", updateLearningNode);

//DELETE OTHERCODE
router.delete("/deleteLearningNode/:id", deleteLearningNode);

module.exports = router;
