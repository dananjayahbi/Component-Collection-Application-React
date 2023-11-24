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
    Box,
    CircularProgress,
    MenuItem,
} from "@mui/material";
import axios from "axios";
import CustomTextField from "../../components/CustomTextField";
import ClearIcon from "@mui/icons-material/Clear";
import LoopIcon from "@mui/icons-material/Loop";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

//YUP validations
const validationSchema = Yup.object({
    imageURL: Yup.string().required("Image URL is required"),
    category: Yup.string().required("Category is required"),
});

//The Main function
export default function UpdateCPIdea(props) {
    const [notify, setNotify] = useState({
        isOpen: false,
        message: "",
        type: "",
    });

    const apiUrl = `http://localhost:8070/ideas/updateCPIdea/${props.ideaID}`; // Change to your API URL

    const navigate = useNavigate();
    const { openPopupUpdateCPIdea, setOpenPopupUpdateCPIdea } = props;
    const [fetchedCPIdeaData, setFetchedCPIdeaData] = useState();
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    async function getCPIdea() {
        setLoading(true);
        await axios
            .get(`http://localhost:8070/ideas/getCPIdea/${props.ideaID}`)
            .then((res) => {
                setFetchedCPIdeaData(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    async function fetchCategories() {
        await axios
            .get("http://localhost:8070/ideaCategories/getAllideaCategories")
            .then((res) => {
                setCategories(res.data.map((category) => category.ideacategoryName));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        if (props.ideaID != null) {
            getCPIdea();
        }
        fetchCategories();
    }, [props, openPopupUpdateCPIdea]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const dataToSend = {
                imageURL: values.imageURL,
                category: values.category,
            };

            await axios.put(apiUrl, dataToSend);
            sessionStorage.setItem("CPIdeaUpdated", "1");
            navigate("/CPIdeas");
        } catch (error) {
            setNotify({
                isOpen: true,
                message: err.response.data.errorMessage,
                type: "error",
            });
        } finally {
            setSubmitting(false);
            setOpenPopupUpdateCPIdea(false);
        }
    };

    return (
        <Dialog
            open={openPopupUpdateCPIdea}
            onBackdropClick={() => setOpenPopupUpdateCPIdea(false)}
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
                            <p className="popupTitle">Update Component Idea</p>
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
                    {loading ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Formik
                            initialValues={{
                                imageURL: fetchedCPIdeaData?.imageURL || "",
                                category: fetchedCPIdeaData?.category || "",
                            }}
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
                                        <CustomTextField
                                            name="imageURL"
                                            label="Image URL"
                                        />
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
                                                <MenuItem key={category} value={category}>
                                                    {category}
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
                                                setOpenPopupUpdateCPIdea(false);
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
                                            startIcon={<LoopIcon />}
                                        >
                                            Update
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    )}
                </DialogContent>
            </div>
        </Dialog>
    );
}
