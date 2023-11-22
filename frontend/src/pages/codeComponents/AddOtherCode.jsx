import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Notification from "../../components/Notification";
import MonacoEditor from "react-monaco-editor";
import { useNavigate } from "react-router-dom";

function AddOtherCode() {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/othercodes");
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

  //formik handle
  const formik = useFormik({
    initialValues: {
      title: "",
      note: "",
      imageURLs: [{ imgURL: "" }],
      codes: [{ language: "", code: "", notes: "" }],
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:8070/otherCodes/addOtherCode",
          values
        );

        if (response.status === 200) {
          sessionStorage.setItem("NoteAdded", "1");
          navigate("/othercodes");
        } else {
          setNotify({
            isOpen: true,
            message: "Adding Note Failed!",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error adding Note:", error);
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

  const handleImageURLChange = (index, event) => {
    const { value } = event.target;
    const updatedImageURLs = [...formik.values.imageURLs];
    updatedImageURLs[index].imgURL = value;
    formik.setFieldValue("imageURLs", updatedImageURLs);
  };

  const addImageURLField = () => {
    const updatedImageURLs = [...formik.values.imageURLs, { imgURL: "" }];
    formik.setFieldValue("imageURLs", updatedImageURLs);
  };

  const removeImageURLField = (index) => {
    const updatedImageURLs = [...formik.values.imageURLs];
    updatedImageURLs.splice(index, 1);
    formik.setFieldValue("imageURLs", updatedImageURLs);
  };

  return (
    <Box p={1}>
      {/* NOTIFICATION */}
      <Notification notify={notify} setNotify={setNotify} />

      {/* Back to the otherCode Button */}
      <Button
        type="button"
        onClick={handleBack}
        variant="contained"
        style={{ marginRight: "10px" }}
      >
        Back
      </Button> <br /> <br />

      {/* Form */}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {/* Title */}
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>
          <Grid item xs={12}>
            {/* Note */}
            <TextField
              fullWidth
              id="note"
              name="note"
              label="Note"
              value={formik.values.note}
              onChange={formik.handleChange}
              error={formik.touched.note && Boolean(formik.errors.note)}
              helperText={formik.touched.note && formik.errors.note}
              multiline
              rows={6}
            />
          </Grid>
          {/* Image URL */}
          {formik.values.imageURLs.map((imageURL, index) => (
            <Grid item xs={12} key={index}>
              <Box display="flex" alignItems="center" marginBottom="10px">
                <TextField
                  fullWidth
                  id={`imageURLs[${index}].imgURL`}
                  name={`imageURLs[${index}].imgURL`}
                  label="Image URL"
                  value={imageURL.imgURL}
                  onChange={(event) => handleImageURLChange(index, event)}
                  error={
                    formik.touched.imageURLs &&
                    formik.touched.imageURLs[index]?.imgURL &&
                    Boolean(formik.errors.imageURLs)
                  }
                  helperText={
                    formik.touched.imageURLs &&
                    formik.touched.imageURLs[index]?.imgURL &&
                    formik.errors.imageURLs
                  }
                />
                {index > 0 && (
                  <IconButton
                    onClick={() => removeImageURLField(index)}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
              {imageURL.imgURL && (
                <>
                  <br /> {/* Add line break */}
                  <img
                    src={imageURL.imgURL}
                    alt="&nbsp;Invalid URL"
                    style={{
                      marginLeft: "10px",
                      height: "auto",
                      width: "auto",
                      maxWidth: "500px",
                    }}
                  />
                </>
              )}
            </Grid>
          ))}
          <Grid item xs={12}>
            {/* Add Image URL Button */}
            <Button
              color="primary"
              variant="outlined"
              onClick={addImageURLField}
              style={{ marginBottom: "10px" }}
            >
              Add Image URL
            </Button>
          </Grid>

        <Typography variant="h6" style={{ marginTop:"20px", marginLeft:"15px" }}>Code Inputs</Typography>

          {/* Codes Fields */}
          <Grid item xs={12}>
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
          </Grid>

          <Grid item xs={12}>
            {/* Submit Button */}
            <Button color="primary" variant="contained" fullWidth type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default AddOtherCode;
