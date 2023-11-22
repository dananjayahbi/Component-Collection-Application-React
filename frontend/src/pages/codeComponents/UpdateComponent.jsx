import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  IconButton,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Notification from "../../components/Notification";
import MonacoEditor from "react-monaco-editor";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function UpdateComponent() {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const [categories, setCategories] = useState([]);
  const [IMGURL, setIMGURL] = useState("");
  const [componentData, setComponentData] = useState(null);
  const componentId = useParams(); // Get component ID from URL
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchComponentData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8070/Components/getComponent/${componentId.id}`
        );

        if (response.status === 200) {
          setComponentData(response.data); // Set component data to state
          // Populate form fields with component data here
          // For example: formik.setValues({ componentName: response.data.componentName, ... });
          formik.setValues({
            componentName: response.data.componentName || "",
            category: response.data.category || "",
            mainTechnology: response.data.mainTechnology || "",
            imageURL: componentData.imageURL || "",
            description: componentData.description || "",
            notes: componentData.notes || "",
            codes: componentData.codes || [
              { language: "", code: "", notes: "" },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching component data:", error);
      }
    };

    fetchComponentData();
  }, [componentId]);

  const handleChange = (event) => {
    formik.handleChange(event);
    setIMGURL(event.target.value);
  };

  const handleBlur = (event) => {
    formik.handleBlur(event);
    setIMGURL(event.target.value);
  };

  const handleCodeFieldChange = (value, index) => {
    const updatedCodes = [...formik.values.codes];
    updatedCodes[index].code = value;

    formik.handleChange({
      target: {
        name: `codes[${index}].code`,
        value: updatedCodes[index].code,
      },
    });
  };

  const formik = useFormik({
    initialValues: componentData
      ? {
          componentName: componentData.componentName || "",
          category: componentData.category || "",
          mainTechnology: componentData.mainTechnology || "",
          imageURL: componentData.imageURL || "",
          description: componentData.description || "",
          notes: componentData.notes || "",
          codes: componentData.codes || [{ language: "", code: "", notes: "" }],
        }
      : {
          componentName: "",
          category: "",
          mainTechnology: "",
          imageURL: "",
          description: "",
          notes: "",
          codes: [{ language: "", code: "", notes: "" }],
        },
    onSubmit: async (values) => {
      try {
        const response = await axios.put(
          `http://localhost:8070/Components/updateComponent/${componentId.id}`,
          values
        );

        if (response.status === 200) {
          setNotify({
            isOpen: true,
            message: "Component Updated Successfully!",
            type: "success",
          });
          window.location.reload();
        } else {
          setNotify({
            isOpen: true,
            message: "Updating Component Failed!",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error updating component:", error);
      }
    },
  });

  const addCodeField = () => {
    formik.setValues({
      ...formik.values,
      codes: [...formik.values.codes, { language: "", code: "" }],
    });
  };

  const removeCodeField = (index) => {
    const updatedCodes = [...formik.values.codes];
    updatedCodes.splice(index, 1);
    formik.setValues({
      ...formik.values,
      codes: updatedCodes,
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8070/Categories/getAllCategories"
        );

        if (response.status === 200) {
          setCategories(response.data.map((category) => category.categoryName));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = () => {
    // Display a confirmation dialog
    if (window.confirm("Are you sure you want to delete this component?")) {
      axios
        .delete(
          `http://localhost:8070/Components/deleteComponent/${componentId.id}`
        )
        .then((response) => {
          if (response.status === 200) {
            sessionStorage.setItem("componentDeleted", "1");
            navigate("/");
          } else {
            setNotify({
              isOpen: true,
              message: "Deletion Failed!",
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.error("Error deleting component:", error);
        });
    }
  };

  return (
    <Box p={1}>
      {/* NOTIFICATION */}
      <Notification notify={notify} setNotify={setNotify} />
      <form onSubmit={formik.handleSubmit}>
        <Box>
          {/* Back to the otherCode Button */}
          <Button
            type="button"
            onClick={handleBack}
            variant="contained"
            style={{ marginRight: "10px" }}
          >
            Back
          </Button> <br /><br />
          <Typography variant="h5">View, Update or Delete Component</Typography>
          <Divider sx={{ mt: 2, mb: 2.5 }} />
        </Box>

        {/* Your Formik form fields */}
        <TextField
          label="Component Name"
          fullWidth
          margin="normal"
          name="componentName"
          value={formik.values.componentName}
          onChange={formik.handleChange}
        />

        {/* Category Dropdown */}
        <TextField
          select
          label="Category"
          fullWidth
          margin="normal"
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>

        {/* Main Technology Dropdown */}
        <TextField
          select
          label="Main Technology"
          fullWidth
          margin="normal"
          name="mainTechnology"
          value={formik.values.mainTechnology}
          onChange={formik.handleChange}
        >
          <MenuItem value="MERN">MERN</MenuItem>
          <MenuItem value="HTML,CSS,JS,PHP,MYSQL">
            HTML,CSS,JS,PHP,MYSQL
          </MenuItem>
        </TextField>

        <TextField
          label="Image URL"
          fullWidth
          margin="normal"
          name="imageURL"
          value={formik.values.imageURL}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {/* Display Image Box */}
        {formik.values.imageURL && (
          <Box>
            <Typography variant="h6" style={{ marginTop: "20px" }}>
              Image Preview
            </Typography>
            <img
              src={formik.values.imageURL}
              alt="&nbsp;&nbsp;invalid URL"
              style={{ maxWidth: "100%" }}
            />
          </Box>
        )}

        <TextField
          label="Description"
          fullWidth
          margin="normal"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          multiline
          minRows={6}
        />

        <TextField
          label="Notes"
          fullWidth
          margin="normal"
          name="notes"
          value={formik.values.notes}
          onChange={formik.handleChange}
          multiline
          minRows={6}
        />

        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Code Inputs
        </Typography>
        <Divider sx={{ mt: 2, mb: 2.5 }} />

        {/* Codes Fields */}
        {formik.values.codes.map((codeField, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection="column"
            style={{
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              padding: "20px",
              marginTop: "20px",
              marginBottom: "25px",
            }}
          >
            <TextField
              select
              label="Language"
              margin="normal"
              name={`codes[${index}].language`}
              value={codeField.language}
              onChange={formik.handleChange}
              style={{ marginRight: "5px", width: "300px" }}
            >
              <MenuItem value="HTML">HTML</MenuItem>
              <MenuItem value="CSS">CSS</MenuItem>
              <MenuItem value="JavaScript">JavaScript</MenuItem>
              <MenuItem value="PHP">PHP</MenuItem>
              <MenuItem value="MySQL">MySQL</MenuItem>
              <MenuItem value="React">React</MenuItem>
              <MenuItem value="NodeJS">NodeJS</MenuItem>
              <MenuItem value="TypeScript">TypeScript</MenuItem>
              <MenuItem value="JSON">JSON</MenuItem>
            </TextField>

            <MonacoEditor
              height="1000"
              name={`codes[${index}].code`}
              language="javascript"
              theme="vs-dark"
              value={codeField.code}
              options={{
                selectOnLineNumbers: true,
                automaticLayout: true,
                padding: { top: 20, bottom: 20 },
              }}
              onChange={(value) => handleCodeFieldChange(value, index)}
            />

            <TextField
              label="Notes"
              margin="normal"
              name={`codes[${index}].notes`}
              value={codeField.notes}
              onChange={formik.handleChange}
              multiline
              minRows={7}
            />

            {/* Remove Code Field Button */}
            <IconButton
              type="button"
              onClick={() => removeCodeField(index)}
              size="small"
              color="error"
              style={{ width: "35px", marginLeft: "auto" }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        {/* Add Code Field Button */}
        <Button
          type="button"
          onClick={addCodeField}
          variant="outlined"
          style={{ marginRight: "10px" }}
        >
          Add Code Field
        </Button>

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary">
          Update
        </Button>
        <Button
          type="button"
          onClick={handleDelete}
          style={{ marginLeft: "10px" }}
          variant="outlined"
          color="error"
        >
          Delete Component
        </Button>
      </form>
    </Box>
  );
}
