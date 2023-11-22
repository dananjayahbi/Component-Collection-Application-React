import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
  Divider,
  MenuItem,
  Dialog,
  DialogContent,
  Slide,
  Box,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Notification from "../../components/Notification";
import MonacoEditor from "react-monaco-editor";

//Popup transition
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function ViewAndUpdateLearningNode(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const { openPopupVNULNode, setOpenPopupVNULNode } = props; //for the popup
  const FetchedLearningNode = props.learningNodeData; //Asigning the fetched LearningNodeData to a variable from props

  useEffect(() => {
    if (FetchedLearningNode) {
      formik.setValues({
        title: FetchedLearningNode.title || "",
        note: FetchedLearningNode.note || "",
        sections: FetchedLearningNode.sections.map((section) => ({
          title: section.title || "",
          note: section.note || "",
          imageURLs: section.imageURLs.map((imageURL) => ({
            imgURL: imageURL.imgURL || "",
          })),
          codes: section.codes.map((code) => ({
            language: code.language || "",
            title: code.title || "",
            code: code.code || "",
            notes: code.notes || "",
          })),
        })),
      });
    }
  }, [FetchedLearningNode]);

  const formik = useFormik({
    initialValues: FetchedLearningNode
      ? {
          title: FetchedLearningNode.title || "",
          note: FetchedLearningNode.note || "",
          sections: FetchedLearningNode.sections.map((section) => ({
            title: section.title || "",
            note: section.note || "",
            imageURLs: section.imageURLs.map((imageURL) => ({
              imgURL: imageURL.imgURL || "",
            })),
            codes: section.codes.map((code) => ({
              language: code.language || "",
              title: code.title || "",
              code: code.code || "",
              notes: code.notes || "",
            })),
          })),
        }
      : {
          title: "",
          sections: [],
        },
    onSubmit: async (values) => {
      try {
        const response = await axios.put(
          `http://localhost:8070/learningNodes/updateLearningNode/${FetchedLearningNode._id}`,
          values
        );

        if (response.status === 200) {
          sessionStorage.setItem("NodeUpdated", "1");
          window.location.reload();
        } else {
          setNotify({
            isOpen: true,
            message: "Updating Node Failed!",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error updating Node:", error);
      }
    },
  });

  const handleAddSection = () => {
    formik.setFieldValue("sections", [
      ...formik.values.sections,
      {
        title: "",
        note: "",
        imageURLs: [{ imgURL: "" }],
        codes: [],
      },
    ]);
  };

  const handleRemoveSection = (sectionIndex) => {
    const updatedSections = formik.values.sections.filter(
      (_, index) => index !== sectionIndex
    );
    formik.setFieldValue("sections", updatedSections);
  };

  const handleAddImageURL = (sectionIndex) => {
    formik.setFieldValue(`sections[${sectionIndex}].imageURLs`, [
      ...formik.values.sections[sectionIndex].imageURLs,
      { imgURL: "" },
    ]);
  };

  const handleRemoveImageURL = (sectionIndex, imageURLIndex) => {
    const updatedImageURLs = formik.values.sections[
      sectionIndex
    ].imageURLs.filter((_, index) => index !== imageURLIndex);
    formik.setFieldValue(
      `sections[${sectionIndex}].imageURLs`,
      updatedImageURLs
    );
  };

  const handleAddCode = (sectionIndex) => {
    formik.setFieldValue(`sections[${sectionIndex}].codes`, [
      ...formik.values.sections[sectionIndex].codes,
      { language: "", title: "", code: "", notes: "" },
    ]);
  };

  const handleRemoveCode = (sectionIndex, codeIndex) => {
    const updatedCodes = formik.values.sections[sectionIndex].codes.filter(
      (_, index) => index !== codeIndex
    );
    formik.setFieldValue(`sections[${sectionIndex}].codes`, updatedCodes);
  };

  const handleCodeFieldChange = (value, sectionIndex, codeIndex) => {
    formik.setFieldValue(
      `sections[${sectionIndex}].codes[${codeIndex}].code`,
      value
    );
  };

  return (
    <>
      <Dialog
        open={openPopupVNULNode}
        TransitionComponent={Transition}
        keepMounted
        onBackdropClick={() => setOpenPopupVNULNode(false)}
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
                    <TextField
                      fullWidth
                      id="title"
                      name="title"
                      label="Title"
                      required
                      value={formik.values.title}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  {formik.values.sections.map((section, sectionIndex) => (
                    <Grid
                      container
                      item
                      spacing={2}
                      key={sectionIndex}
                      style={{
                        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        borderRadius: "10px",
                        marginTop: "20px",
                        marginLeft: "18px",
                        padding: "20px",
                      }}
                    >
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id={`sections[${sectionIndex}].title`}
                          name={`sections[${sectionIndex}].title`}
                          label="Section Title"
                          value={section.title}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          id={`sections[${sectionIndex}].note`}
                          name={`sections[${sectionIndex}].note`}
                          label="Section Note"
                          value={section.note}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      {section.imageURLs.map((imageURL, imageURLIndex) => (
                        <Grid container item spacing={2} key={imageURLIndex}>
                          <Grid item xs={10}>
                            <TextField
                              fullWidth
                              id={`sections[${sectionIndex}].imageURLs[${imageURLIndex}].imgURL`}
                              name={`sections[${sectionIndex}].imageURLs[${imageURLIndex}].imgURL`}
                              label="Image URL"
                              value={imageURL.imgURL}
                              onChange={formik.handleChange}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton
                              onClick={() =>
                                handleRemoveImageURL(
                                  sectionIndex,
                                  imageURLIndex
                                )
                              }
                            >
                              <RemoveIcon />
                            </IconButton>
                          </Grid>
                          {imageURL.imgURL && (
                            <>
                              <br />
                              <img
                                src={imageURL.imgURL}
                                alt="&nbsp;Invalid URL"
                                style={{
                                  marginTop: "5px",
                                  marginLeft: "15px",
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
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => handleAddImageURL(sectionIndex)}
                        >
                          Add Image URL
                        </Button>
                      </Grid>
                      {section.codes.map((code, codeIndex) => (
                        <Grid
                          container
                          item
                          spacing={2}
                          key={codeIndex}
                          style={{
                            backgroundColor: "#bbbbc5",
                            padding: "10px 15px 10px 0",
                            borderRadius: "5px",
                            marginTop: "10px",
                            marginLeft: "0px",
                          }}
                        >
                          <Grid item xs={4}>
                            <TextField
                              select
                              label="Code Language"
                              labelid={`sections[${sectionIndex}].codes[${codeIndex}].language`}
                              id={`sections[${sectionIndex}].codes[${codeIndex}].language`}
                              name={`sections[${sectionIndex}].codes[${codeIndex}].language`}
                              value={code.language}
                              onChange={formik.handleChange}
                              fullWidth
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
                          </Grid>
                          <Grid item xs={8}>
                            <TextField
                              fullWidth
                              id={`sections[${sectionIndex}].codes[${codeIndex}].title`}
                              name={`sections[${sectionIndex}].codes[${codeIndex}].title`}
                              label="Code Title"
                              value={code.title}
                              onChange={formik.handleChange}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <MonacoEditor
                              height="500"
                              id={`sections[${sectionIndex}].codes[${codeIndex}].code`}
                              name={`sections[${sectionIndex}].codes[${codeIndex}].code`}
                              language="javascript"
                              theme="vs-dark"
                              value={code.code}
                              options={{
                                selectOnLineNumbers: true,
                                automaticLayout: true,
                                padding: { top: 20, bottom: 20 },
                              }}
                              onChange={(value) =>
                                handleCodeFieldChange(
                                  value,
                                  sectionIndex,
                                  codeIndex
                                )
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              multiline
                              id={`sections[${sectionIndex}].codes[${codeIndex}].notes`}
                              name={`sections[${sectionIndex}].codes[${codeIndex}].notes`}
                              label="Code Notes"
                              value={code.notes}
                              onChange={formik.handleChange}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            container
                            justifyContent="flex-end"
                          >
                            <IconButton
                              onClick={() =>
                                handleRemoveCode(sectionIndex, codeIndex)
                              }
                            >
                              <RemoveIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => handleAddCode(sectionIndex)}
                        >
                          Add Code
                        </Button>
                      </Grid>
                      <Grid item xs={12} container justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          startIcon={<RemoveIcon />}
                          onClick={() => handleRemoveSection(sectionIndex)}
                        >
                          Remove Section
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddSection}
                    >
                      Add Section
                    </Button>
                  </Grid>
                  <Grid item xs={12} container justifyContent="flex-end">
                    <Button type="submit" variant="contained" color="primary">
                      Submit The Node
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
}
