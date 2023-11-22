const Components = require("../models/components.model");
const axios = require('axios');
const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Function to generate a random CID
function generateRandomCID() {
  const prefix = "CM"; // First letter
  const length = 10; // Total length of the CID
  const digits = "0123456789"; // Allowed digits

  let cid = prefix;

  for (let i = 0; i < length - prefix.length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    cid += digits[randomIndex];
  }

  return cid;
}

// Function to download and backup images
const backupImages = async (req, res) => {
  try {
    // Fetch data from the server (replace with your actual endpoint)
    const response = await axios.get('http://localhost:8070/Components/getAllComponents');
    const components = response.data;

    // Create a ZIP file using JSZip
    const zip = new JSZip();

    // Create a folder for images
    const imageFolder = zip.folder('ComponentImagesDownload');

    // Process each component and add images to the ZIP file
    await Promise.all(
      components.map(async (component) => {
        const { _id, imageURL } = component;

        try {
          // Fetch the image and add it to the ZIP file
          const imageResponse = await axios.get(imageURL, { responseType: 'arraybuffer' });
          const imageName = `${_id}.jpg`; // Change the file extension based on your images
          imageFolder.file(imageName, imageResponse.data, { binary: true });
        } catch (error) {
          console.error(`Error fetching image for component ${_id}:`, error);
        }
      })
    );

    // Generate the ZIP file
    const zipContent = await zip.generateAsync({ type: 'nodebuffer' });

    // Specify the path to the user's Downloads folder
    const downloadsFolderPath = path.join(require('os').homedir(), 'Downloads');

    // Save the ZIP file to the Downloads folder
    const zipFileName = 'ComponentImages.zip';
    const zipFilePath = path.join(downloadsFolderPath, zipFileName);
    fs.writeFileSync(zipFilePath, zipContent);

    console.log('Images backed up successfully. ZIP file saved to:', zipFilePath);

    // Send a success status to the frontend
    res.status(200).json({ success: true, message: 'Images backed up successfully.' });

  } catch (error) {
    console.error('Error backing up images:', error);
    // Send an error status to the frontend
    res.status(500).json({ success: false, message: 'Error backing up images.' });
  }
};

// Add Component
const addComponent = async (req, res) => {
  const {
    componentName,
    category,
    mainTechnology,
    imageURL,
    description,
    notes,
    codes,
  } = req.body;

  let existingComponent;
  let component;
  let cid; // Declare cid variable outside of the loop

  do {
    cid = generateRandomCID(); // Assign the generated CID
    existingComponent = await Components.findOne({
      CID: cid,
    });
  } while (existingComponent);

  component = await Components.create({
    CID: cid,
    componentName,
    category,
    mainTechnology,
    imageURL,
    description,
    notes,
    codes,
  });

  if (component) {
    res.status(200);
    res.json("Component added");
  } else {
    res.status(400);
    res.json("Adding Component failed");
  }
};

//Get All Components
const getAllComponents = async (req, res) => {
  const abc = await Components.find()
    .then((components) => {
      res.json(components);
    })
    .catch((e) => {
      console.log(e);
    });
};

//Get a Component
const getComponent = async (req, res) => {
  try {
    const componentObject = await Components.findById(req.params.id);

    if (!componentObject) {
      return res.status(404).json({ error: "Component not found" });
    }

    const {
      _id,
      CID: cid,
      componentName,
      category,
      mainTechnology,
      imageURL,
      description,
      notes,
      codes,
    } = componentObject;

    res.status(200).json({
      _id,
      CID: cid,
      componentName,
      category,
      mainTechnology,
      imageURL,
      description,
      notes,
      codes,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//Update Component
const updateComponent = async (req, res) => {
  try {
    const {
      componentName,
      category,
      mainTechnology,
      imageURL,
      description,
      notes,
      codes,
    } = req.body;

    let updateData = {
      componentName,
      category,
      mainTechnology,
      imageURL,
      description,
      notes,
      codes,
    };

    // Updating
    const update = await Components.findByIdAndUpdate(
      req.params.id,
      updateData
    );

    if (update) {
      res.status(200).json({
        data: "Component updated successfully",
        status: true,
      });
    } else {
      res.status(401).json({
        errorMessage: "Failed to edit the Component!",
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

//Delete Component
const deleteComponent = async (req, res) => {
  try {
    const deleted = await Components.findByIdAndDelete(req.params.id);

    if (deleted) {
      res.status(200).json({
        data: "Component Deleted",
        status: true,
      });
    } else {
      res.status(401).json({
        errrorMessage: "Failed to delete the Component!",
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
  backupImages,
  addComponent,
  getAllComponents,
  getComponent,
  updateComponent,
  deleteComponent,
};
