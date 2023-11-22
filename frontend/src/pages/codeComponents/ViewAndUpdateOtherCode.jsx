import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Divider,
  Grid,
  Slide,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useFormik } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Notification from "../../components/Notification";
import MonacoEditor from "react-monaco-editor";

//Popup transition
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

//Main function
function ViewAndUpdateOtherCode(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const { openPopupVNU, setOpenPopupVNU } = props; //for the popup
  const FetchedOtherCode = props.otherCodeData; //Asigning the fetched otherCodeData to a variable from props

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

  useEffect(() => {
    if (FetchedOtherCode) {
      formik.setValues({
        title: FetchedOtherCode.title || "",
        note: FetchedOtherCode.note || "",
        imageURLs: FetchedOtherCode.imageURLs || [{ imgURL: "" }],
        codes: FetchedOtherCode.codes || [{ language: "", code: "", note: "" }],
      });
    }
  }, [FetchedOtherCode]);

  //formik handle
  const formik = useFormik({
    initialValues: FetchedOtherCode
      ? {
          title: FetchedOtherCode.title || "",
          note: FetchedOtherCode.note || "",
          imageURLs: FetchedOtherCode.imageURLs || [{ imgURL: "" }],
          codes: FetchedOtherCode.codes || [
            { language: "", code: "", note: "" },
          ],
        }
      : {
          title: "",
          note: "",
          imageURLs: [{ imgURL: "" }],
          codes: [{ language: "", code: "", note: "" }],
        },
    onSubmit: async (values) => {
      try {
        const response = await axios.put(
          `http://localhost:8070/otherCodes/updateOtherCode/${FetchedOtherCode._id}`,
          values
        );

        console.log(values);

        if (response.status === 200) {
          sessionStorage.setItem("NoteUpdated", "1");
          window.location.reload();
        } else {
          setNotify({
            isOpen: true,
            message: "Updating Note Failed!",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error Updating Note:", error);
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
    <Dialog
      open={openPopupVNU}
      TransitionComponent={Transition}
      keepMounted
      onBackdropClick={() => setOpenPopupVNU(false)}
      maxWidth="xl"
      PaperProps={{
        style: {
          borderRadius: 10,
          width: "80%",
          padding: "20px",
          paddingBottom: "30px",
        },
      }}
    >
      <div className="popup">
        <DialogTitle>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <p className="popupTitle">View & Update</p>
            </div>
          </div>

          {/* NOTIFICATION */}
          <Notification notify={notify} setNotify={setNotify} />

          <Divider
            sx={{
              height: "1px",
              backgroundColor: "var(--dark)",
              marginTop: "10px",
            }}
          />
        </DialogTitle>

        <DialogContent>
          <Box p={1}>
            {/* NOTIFICATION */}
            <Notification notify={notify} setNotify={setNotify} />
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

                <Typography
                  variant="h6"
                  style={{ marginTop: "20px", marginLeft: "15px" }}
                >
                  Code Inputs
                </Typography>

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
                        onChange={(value) =>
                          handleCodeFieldChange(value, index)
                        }
                      />

                      <TextField
                        label="Note"
                        margin="normal"
                        name={`codes[${index}].note`}
                        value={codeField.note}
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

                <Grid item xs={12} container justifyContent="flex-end">
                  {/* Submit Button */}
                  <Button color="primary" variant="contained" type="submit">
                    Update
                  </Button>
                  {/* Cancel Button */}
                  <Button
                    color="primary"
                    variant="outlined"
                    type="button"
                    style={{ marginLeft: "10px" }}
                    onClick={() => setOpenPopupVNU(false)}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default ViewAndUpdateOtherCode;
