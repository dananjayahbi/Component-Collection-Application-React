const router = require("express").Router();

const {
  backupImages,
  addComponent,
  getAllComponents,
  getComponent,
  updateComponent,
  deleteComponent,
} = require("../controllers/componentsController");

//ADD NEW PROJECT
router.post("/addComponent", addComponent);

//GET ALL PROJECTS
router.get("/getAllComponents", getAllComponents);

//GET PROJECT
router.get("/getComponent/:id", getComponent);

//UPDATE PROJECT
router.put("/updateComponent/:id", updateComponent);

//DELETE PROJECT
router.delete("/deleteComponent/:id", deleteComponent);

//BACKUP COMPONENT IMAGES
router.get("/backupImages", backupImages);

module.exports = router;
