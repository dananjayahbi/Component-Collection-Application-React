import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  CircularProgress,
  Typography,
  Divider,
} from "@mui/material";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import AddideaCategory from "./AddCPIdeaCategory";
import UpdateideaCategory from "./UpdateCPIdeaCategory";
import DeleteideaCategory from "./DeleteCPIdeaCategory";

export default function CPIdeasCategories() {
  const [ideaCategories, setideaCategories] = useState([]);
  const [filteredideaCategories, setFilteredideaCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [openPopupAddideaCategory, setOpenPopupAddideaCategory] = useState(false); //Popup
  const [openPopupUpdateideaCategory, setOpenPopupUpdateideaCategory] =
    useState(false); //Popup for Update
  const [openPopupDeleteideaCategory, setOpenPopupDeleteideaCategory] =
    useState(false); //Popup for Delete
  const [fetchedideaCategory, setFetchedideaCategory] = useState(null); //for delete functionality
  const [fetchedideaID, setFetchedideaID] = useState(null);
  const tableRef = useRef(null);

  //Fetch All FP Categories
  useEffect(() => {
    const fetchideaCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:8070/ideaCategories/getAllideaCategories"
        );
        const data = await response.json();
        setideaCategories(data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false); // Set loading to false on error as well
      }
    };

    fetchideaCategories();
  }, [
    openPopupAddideaCategory,
    openPopupUpdateideaCategory,
    openPopupDeleteideaCategory,
  ]);

  //Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filtered = ideaCategories.filter(
      (Category) =>
        Category.ideacategoryName &&
        Category.ideacategoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredideaCategories(filtered);
  }, [ideaCategories, searchTerm]);

  //Handle Update
  function handleUpdate(ideaID) {
    setFetchedideaID(ideaID);
    setOpenPopupUpdateideaCategory(true);
  }

  //Handle Delete
  function handleDelete(ideaID, Category) {
    setFetchedideaCategory(Category);
    setFetchedideaID(ideaID);
    setOpenPopupDeleteideaCategory(true);
  }

  return (
    <Box p={1}>
      <Box>
        <Typography variant="h5">Idea Categories</Typography>
        <Divider sx={{ mt: 2, mb: 7.5 }} />
      </Box>

      <Box display="flex" justifyContent="flex-end" sx={{ mt: -3 }}>
        <TextField
          id="outlined-basic"
          label="Search by Category name"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchTermChange}
          fullWidth
          margin="dense"
          style={{
            width: "30%",
            marginInlineEnd: "10px",
            marginTop: "-20px",
            paddingTop: "5px",
          }}
          InputLabelProps={{ style: { fontSize: "14px" } }} // Reduce font size of label
          inputProps={{
            style: {
              textAlign: "left",
              padding: "10px",
              fontSize: "14px", // Reduce font size of input text
              lineHeight: "1.4", // Vertically center the text
            },
            type: "search", // Change the type attribute
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenPopupAddideaCategory(true);
          }}
          sx={{ mt: -2, height: "40px" }}
        >
          Add Category
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          marginTop: 2,
          overflowX: "auto",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Table ref={tableRef}>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Category name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredideaCategories.length === 0 ? ( // Display "No matching records found"
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No matching records found
                </TableCell>
              </TableRow>
            ) : (
              filteredideaCategories.map((Category) => (
                <TableRow key={Category._id}>
                  <TableCell style={{ whiteSpace: "pre-line", height: "auto" }}>
                    {Category.ideacategoryName}
                  </TableCell>
                  <TableCell style={{ whiteSpace: "pre-line", height: "auto" }}>
                    {Category.description}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        handleUpdate(Category._id);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleDelete(Category._id, Category.ideacategoryName);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
            {/* Display the count of records */}
            <TableRow>
              <TableCell colSpan={7} align="left">
                Total Categories : {filteredideaCategories.length}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <AddideaCategory
        openPopupAddideaCategory={openPopupAddideaCategory}
        setOpenPopupAddideaCategory={setOpenPopupAddideaCategory}
      ></AddideaCategory>
      <UpdateideaCategory
        openPopupUpdateideaCategory={openPopupUpdateideaCategory}
        setOpenPopupUpdateideaCategory={setOpenPopupUpdateideaCategory}
        ideaID={fetchedideaID}
      ></UpdateideaCategory>
      <DeleteideaCategory
        openPopupDeleteideaCategory={openPopupDeleteideaCategory}
        setOpenPopupDeleteideaCategory={setOpenPopupDeleteideaCategory}
        ideaID={fetchedideaID}
        ideacategoryName={fetchedideaCategory}
      ></DeleteideaCategory>
    </Box>
  );
}
