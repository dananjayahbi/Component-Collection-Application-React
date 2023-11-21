const OtherCodes = require("../models/otherCodes.model");

// Function to generate a random OTID
function generateRandomOTID() {
  const prefix = "OT"; // First letters
  const length = 10; // Total length of the OTID
  const digits = "0123456789"; // Allowed digits

  let otid = prefix;

  for (let i = 0; i < length - prefix.length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otid += digits[randomIndex];
  }

  return otid;
}

// Add OtherCode
const addOtherCode = async (req, res) => {
  const { title, note, imageURLs } = req.body;

  let existingOtherCode;
  let otherCode;
  let otid; // Declare otid variable outside of the loop

  do {
    otid = generateRandomOTID(); // Assign the generated OTID
    existingOtherCode = await OtherCodes.findOne({
      OTID: otid,
    });
  } while (existingOtherCode);

  otherCode = await OtherCodes.create({
    OTID: otid,
    title,
    note,
    imageURLs,
  });

  if (otherCode) {
    res.status(200);
    res.json("OtherCode added");
  } else {
    res.status(400);
    res.json("Adding OtherCode failed");
  }
};

//Get All OtherCodes
const getAllOtherCodes = async (req, res) => {
  const abc = await OtherCodes.find()
    .then((otherCodes) => {
      res.json(otherCodes);
    })
    .catch((e) => {
      console.log(e);
    });
};

//Get a OtherCode
const getOtherCode = async (req, res) => {
    try {
      const otherCodeObject = await OtherCodes.findById(req.params.id);
  
      if (!otherCodeObject) {
        return res.status(404).json({ error: 'OtherCode not found' });
      }
  
      const {
        _id,
        OTID: otid,
        title,
        note,
        imageURLs,
      } = otherCodeObject;
  
      res.status(200).json({
        _id,
        OTID: otid,
        title,
        note,
        imageURLs,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

//Update OtherCode
const updateOtherCode = async (req, res) => {
    try {
      const { 
        title,
        note,
        imageURLs,
      } = req.body;
  
      let updateData = {
        title,
        note,
        imageURLs,
      };
  
      // Updating
      const update = await OtherCodes.findByIdAndUpdate(req.params.id, updateData);
  
      if (update) {
        res.status(200).json({
          data: 'OtherCode updated successfully',
          status: true,
        });
      } else {
        res.status(401).json({
          errorMessage: 'Failed to edit the OtherCode!',
          status: false,
        });
      }
      
    } catch (error) {
      res.status(401).json({
        errorMessage: 'Something went wrong!\n' + error,
        status: false,
      });
    }
  };

  //Delete OtherCode
const deleteOtherCode = async (req, res) => {
    try {
      const deleted = await OtherCodes.findByIdAndDelete(req.params.id);
  
      if (deleted) {
        res.status(200).json({
          data: "OtherCode Deleted",
          status: true,
        });
      } else {
        res.status(401).json({
          errrorMessage: "Failed to delete the OtherCode!",
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
  addOtherCode,
  getAllOtherCodes,
  getOtherCode,
  updateOtherCode,
  deleteOtherCode
};
