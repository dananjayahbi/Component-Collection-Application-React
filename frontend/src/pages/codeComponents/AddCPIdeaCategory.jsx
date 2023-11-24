import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  Grid,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material";
import axios from "axios";
import CustomTextField from "../../components/CustomTextField";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// FORMIK
const INITIAL_FORM_STATE = {
  ideacategoryName: "",
  description: "",
};

//YUP validations
const validationSchema = Yup.object({
  ideacategoryName: Yup.string().required("Category name is required"),
  description: Yup.string().required("Description is required"),
});

const apiUrl = "http://localhost:8070/ideaCategories/addideaCategory"; // Change to your API URL

//The Main function
export default function AddideaCategory(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const { openPopupAddideaCategory, setOpenPopupAddideaCategory } = props;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const dataToSend = {
        ideacategoryName: values.ideacategoryName,
        description: values.description,
      };

      await axios.post(apiUrl, dataToSend);
      sessionStorage.setItem("IdeaCategoryCreated", "1");
      navigate("/CPIdeasCategory");
    } catch (error) {
      setNotify({
        isOpen: true,
        message: err.response.data.errorMessage,
        type: "error",
      });
    } finally {
      setSubmitting(false);
      setOpenPopupAddideaCategory(false);
    }
  };

  return (
    <Dialog
      open={openPopupAddideaCategory}
      onBackdropClick={() => setOpenPopupAddideaCategory(false)}
      maxWidth="md"
      TransitionComponent={Transition}
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
              <p className="popupTitle">Add Category</p>
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
          <Formik
            initialValues={{ INITIAL_FORM_STATE }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
              <Form>
                <Grid
                  item
                  xs={12}
                  style={{ marginBottom: "10px", marginTop: "10px" }}
                >
                  <CustomTextField name="ideacategoryName" label="Category Name" />
                </Grid>

                <Grid
                  item
                  xs={12}
                  style={{ marginBottom: "10px", marginTop: "10px" }}
                >
                  <CustomTextField
                    name="description"
                    label="Description"
                    multiline
                    rows={6}
                  />
                </Grid>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "right",
                    marginTop: "1rem",
                  }}
                >
                  <Button
                    startIcon={<ClearIcon />}
                    style={{ marginRight: "15px" }}
                    onClick={() => {
                      setOpenPopupAddideaCategory(false);
                    }}
                    variant="outlined"
                    color="primary"
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </div>
    </Dialog>
  );
}
