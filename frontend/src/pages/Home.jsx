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
import { Formik, Form, Field } from "formik";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);

  useEffect(() => {
    // Fetch categories from the API
    fetch("http://localhost:8070/Categories/getAllCategories")
      .then((response) => response.json())
      .then((data) => setCategories(data));

    // Fetch components from the API
    fetch("http://localhost:8070/Components/getAllComponents")
      .then((response) => response.json())
      .then((data) => setComponents(data));
  }, []);

  const handleSubmit = (values) => {
    // Filter components by category
    const filtered = components.filter((component) => component.category === values.category);

    setFilteredComponents(filtered);
  };

  return (
    <Box>
      <Typography variant="h5">Browse Components</Typography>
      <Divider sx={{ mt: 2, mb: 2.5 }} />

      <Formik initialValues={{ category: "" }} onSubmit={handleSubmit}>
        <Form style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <Grid container spacing={2} style={{ width: "500px" }}>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="category-label">Select Category</InputLabel>
                <Field as={Select} labelId="category-label" label="Select Category" name="category">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.categoryName} value={category.categoryName}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
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
              <CardMedia component="img" height="140" image={component.imageURL} alt={component.componentName} />
              <CardContent>
                <Typography variant="h6" component="div">
                  {component.componentName}
                </Typography>
              </CardContent>
              <CardActions>
                <a href={`/updateComponent/${component._id}`} style={{ textDecoration: "none" }}>
                  <Button size="small" color="primary">
                    View or Update
                  </Button>
                </a>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
