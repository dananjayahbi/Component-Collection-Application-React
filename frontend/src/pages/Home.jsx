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
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import SearchIcon from "@mui/icons-material/Search";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [mainTechnologies, setMainTechnologies] = useState([
    "HTML,CSS,JS,PHP,MYSQL",
    "MERN",
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch categories from the API
    fetch("http://localhost:8070/Categories/getAllCategories")
      .then((response) => response.json())
      .then((data) => setCategories(data));

    // Fetch components from the API
    fetch("http://localhost:8070/Components/getAllComponents")
      .then((response) => response.json())
      .then((data) => {
        setComponents(data);
        setFilteredComponents(shuffleArray(data).slice(0, 10));
      });
  }, []);

  const handleSubmit = (values) => {
    // Filter components by category and mainTechnology
    const filtered = components.filter(
      (component) =>
        (values.category === "" || component.category === values.category) &&
        (values.mainTechnology === "" ||
          component.mainTechnology === values.mainTechnology)
    );

    setFilteredComponents(filtered);
  };

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

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    // Filter components by searchTerm
    const filtered = components.filter((component) =>
      component.componentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredComponents(filtered);
  };

  return (
    <Box>
      <Typography variant="h5">Browse Components</Typography>
      <Divider sx={{ mt: 2, mb: 2.5 }} />

      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <TextField
          label="Search by componentName"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Formik
        initialValues={{ category: "", mainTechnology: "" }}
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
                      key={category.categoryName}
                      value={category.categoryName}
                    >
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="main-technology-label">
                  Select Main Technology
                </InputLabel>
                <Field
                  as={Select}
                  labelId="main-technology-label"
                  label="Select Main Technology"
                  name="mainTechnology"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {mainTechnologies.map((technology) => (
                    <MenuItem key={technology} value={technology}>
                      {technology}
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
        {filteredComponents.map((component) => (
          <Grid item key={component.id} xs={12} sm={6}>
            <Card sx={{ maxWidth: 645 }}>
              <CardMedia
                component="img"
                height="140"
                image={component.imageURL}
                alt={component.componentName}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {component.componentName}
                </Typography>
              </CardContent>
              <CardActions>
                <a
                  href={`/updateComponent/${component._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button size="small" color="primary">
                    View or Update
                  </Button>
                </a>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* If no results found */}
      {filteredComponents.length === 0 ? (
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
    </Box>
  );
}
