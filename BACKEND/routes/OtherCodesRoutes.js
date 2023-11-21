const router = require("express").Router();

const {
    addOtherCode,
    getAllOtherCodes,
    getOtherCode,
    updateOtherCode,
    deleteOtherCode
} = require("../controllers/otherCodesController")

//ADD NEW OTHERCODE
router.post("/addOtherCode", addOtherCode);

//GET ALL OTHERCODES
router.get("/getAllOtherCodes", getAllOtherCodes);

//GET OTHERCODE
router.get("/getOtherCode/:id", getOtherCode);

//UPDATE OTHERCODE
router.put("/updateOtherCode/:id", updateOtherCode);

//DELETE OTHERCODE
router.delete("/deleteOtherCode/:id", deleteOtherCode);


module.exports = router;