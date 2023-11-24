import React, { useState, useEffect } from "react";
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
    MenuItem,
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
    imageURL: "",
    category: "",
};

//YUP validations
const validationSchema = Yup.object({
    imageURL: Yup.string().required("ImageURL is required"),
    category: Yup.string().required("Category is required"),
});

const apiUrl = "http://localhost:8070/ideas/addIdea"; // Change to your API URL
const categoryApiUrl = "http://localhost:8070/ideaCategories/getAllideaCategories"; // Change to your API URL for getting categories

//The Main function
export default function AddCPIdea(props) {
    const [notify, setNotify] = useState({
        isOpen: false,
        message: "",
        type: "",
    });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const { openPopupAddCPIdea, setOpenPopupAddCPIdea } = props;

    useEffect(() => {
        // Fetch categories from API
        const fetchCategories = async () => {
            try {
                const response = await axios.get(categoryApiUrl);
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const dataToSend = {
                imageURL: values.imageURL,
                category: values.category,
            };

            await axios.post(apiUrl, dataToSend);
            sessionStorage.setItem("CPIdeaCreated", "1");
            navigate("/CPIdeas");
        } catch (error) {
            setNotify({
                isOpen: true,
                message: err.response.data.errorMessage,
                type: "error",
            });
        } finally {
            setSubmitting(false);
            setOpenPopupAddCPIdea(false);
        }
    };

    return (
        <Dialog
            open={openPopupAddCPIdea}
            onBackdropClick={() => setOpenPopupAddCPIdea(false)}
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
                            <p className="popupTitle">Add Component Idea</p>
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
                        initialValues={INITIAL_FORM_STATE}
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
                                    <CustomTextField name="imageURL" label="Image URL" />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    style={{ marginBottom: "10px", marginTop: "10px" }}
                                >
                                    <CustomTextField
                                        name="category"
                                        label="Category"
                                        select
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category.ideacategoryName} value={category.ideacategoryName}>
                                                {category.ideacategoryName}
                                            </MenuItem>
                                        ))}
                                    </CustomTextField>
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
                                            setOpenPopupAddCPIdea(false);
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
