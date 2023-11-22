const Components = require("../models/components.model");

// Function to generate a random CID
function generateRandomCID() {
  const prefix = 'CM'; // First letter
  const length = 10; // Total length of the CID
  const digits = '0123456789'; // Allowed digits

  let cid = prefix;

  for (let i = 0; i < length - prefix.length; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      cid += digits[randomIndex];
  }

  return cid;
}

// Add Component
const addComponent = async (req, res) => {
  const {
    componentName,
    category,
    mainTechnology,
    imageURL,
    description,
    notes,
    codes
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
    codes
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
        return res.status(404).json({ error: 'Component not found' });
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
        codes
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
        codes
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
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
        codes
      } = req.body;
  
      let updateData = {
        componentName,
        category,
        mainTechnology,
        imageURL,
        description,
        notes,
        codes
      };
  
      // Updating
      const update = await Components.findByIdAndUpdate(req.params.id, updateData);
  
      if (update) {
        res.status(200).json({
          data: 'Component updated successfully',
          status: true,
        });
      } else {
        res.status(401).json({
          errorMessage: 'Failed to edit the Component!',
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
  addComponent,
  getAllComponents,
  getComponent,
  updateComponent,
  deleteComponent
}