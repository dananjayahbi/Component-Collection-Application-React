const router = require("express").Router();

const {
    addIdea,
    getAllCPIdeas,
    getCPIdea,
    updateCPIdea,
    deleteCPIdea,
} = require("../controllers/CPIdeasController");

//ADD NEW  CPIDEA
router.post("/addIdea", addIdea);

//GET ALL  CPIDEAs
router.get("/getAllCPIdeas", getAllCPIdeas);

//GET  CPIDEA
router.get("/getCPIdea/:id", getCPIdea);

//UPDATE  CPIDEA
router.put("/updateCPIdea/:id", updateCPIdea);

//DELETE  CPIDEA
router.delete("/deleteCPIdea/:id", deleteCPIdea);

module.exports = router;
