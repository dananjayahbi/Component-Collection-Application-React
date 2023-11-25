import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon
} from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import AddCPIdea from "./AddCPIdea";
import UpdateCPIdea from "./UpdateCPIdea";
import DeleteCPIdea from "./DeleteCPIdea";

export default function CPIdeas() {
  const [categories, setCategories] = useState([]);
  const [components, setComponents] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [openPopupAddCPIdea, setOpenPopupAddCPIdea] = useState(false);
  const [openPopupUpdateCPIdea, setOpenPopupUpdateCPIdea] = useState(false);
  const [openPopupDeleteCPIdea, setOpenPopupDeleteCPIdea] = useState(false);
  const [fetchedIdeaId, setFetchedIdeaId] = useState(null);
  const [fetchedCPIdea, setFetchedCPIdea] = useState(null); //for delete functionality

  useEffect(() => {
    // Fetch categories from the API
    fetch("http://localhost:8070/ideaCategories/getAllideaCategories")
      .then((response) => response.json())
      .then((data) => setCategories(data));

    // Fetch components from the API
    fetch("http://localhost:8070/ideas/getAllCPIdeas")
      .then((response) => response.json())
      .then((data) => {
        setComponents(data);
        setFilteredIdeas(shuffleArray(data).slice(0, 10));
      });
  }, []);

  const handleSubmit = (values) => {
    // Filter components by category
    const filtered = components.filter(
      (component) =>
        values.category === "" || component.category === values.category
    );

    setFilteredIdeas(filtered);
  };

  //Handle Update
  function handleUpdate(IdeaId) {
    setFetchedIdeaId(IdeaId);
    setOpenPopupUpdateCPIdea(true);
  }

  //Handle Delete
  function handleDelete(IdeaId, idea) {
    setFetchedCPIdea(idea);
    setFetchedIdeaId(IdeaId);
    setOpenPopupDeleteCPIdea(true);
  }

  // Function to shuffle an array
  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  return (
    <Box>
      <Typography variant="h5">Browse Component Ideas</Typography>
      <Divider sx={{ mt: 2, mb: 2.5 }} />

      <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenPopupAddCPIdea(true);
          }}
          style={{ marginBottom: "20px" }}
        >
          Add Idea
        </Button>

      <Formik
        initialValues={{ category: "" }}
        onSubmit={handleSubmit}
      >
        <Form
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Grid container spacing={2} style={{ width: "500px" }}>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="category-label">Select Category</InputLabel>
                <Field
                  as={Select}
                  labelId="category-label"
                  label="Select Category"
                  name="category"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem
                      key={category.ideacategoryName}
                      value={category.ideacategoryName}
                    >
                      {category.ideacategoryName}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Find
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Formik>

      <Grid container spacing={2}>
        {filteredIdeas.map((component) => (
          <Grid item key={component._id} xs={12} sm={6}>
            <Card sx={{ maxWidth: 645 }}>
              <CardMedia
                component="img"
                height="140"
                image={component.imageURL}
                alt={component.ideacomponentName}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {component.componentName}
                </Typography>
              </CardContent>
              <CardActions>
                  <Button size="small" variant="outlined" color="primary" onClick={() => {handleUpdate(component._id)}}>
                    Update
                  </Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => {handleDelete(component._id, component)}}>
                    Delete
                  </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* If no results found */}
      {filteredIdeas.length === 0 ? (
        <Grid container spacing={2} style={{ height: "100vh" }}>
          <Grid
            item
            xs={12}
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "100px",
            }}
          >
            <img
              src="https://img.freepik.com/free-vector/business-background-design_1343-21.jpg?w=740&t=st=1700673907~exp=1700674507~hmac=50bc49b08b1f5f674ecdfd0dbd7a2955a62ffab94a720de8c9e9500e81b941af"
              alt="No Results Found"
              style={{ width: "300px", height: "300px", borderRadius: "50%" }}
            />
            <Typography variant="h6" style={{ marginTop: "10px" }}>
              No results found.
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <></>
      )}

      <AddCPIdea
        openPopupAddCPIdea={openPopupAddCPIdea}
        setOpenPopupAddCPIdea={setOpenPopupAddCPIdea}
      ></AddCPIdea>
      <UpdateCPIdea
        openPopupUpdateCPIdea={openPopupUpdateCPIdea}
        setOpenPopupUpdateCPIdea={setOpenPopupUpdateCPIdea}
        ideaID={fetchedIdeaId}
      ></UpdateCPIdea>
      <DeleteCPIdea
        openPopupDeleteCPIdea={openPopupDeleteCPIdea}
        setOpenPopupDeleteCPIdea={setOpenPopupDeleteCPIdea}
        CPIdeaData={fetchedCPIdea}
      ></DeleteCPIdea>
    </Box>
  );
}
