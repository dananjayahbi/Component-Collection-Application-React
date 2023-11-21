import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Card,
  CardContent,
  Grid,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";
import SearchIcon from "@mui/icons-material/Search";

export default function OtherCodes() {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [otherCodes, setOtherCodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the backend API
    fetch("http://localhost:8070/otherCodes/getAllOtherCodes")
      .then((response) => response.json())
      .then((data) => setOtherCodes(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleAddNote = () => {
    navigate("/AddOtherCode");
  };

  const handleViewEdit = (otid) => {
    // Implement the logic for viewing/editing a specific OtherCode
    console.log(`View/Edit ${otid}`);
  };

  const handleDelete = (otid) => {
    // Implement the logic for deleting a specific OtherCode
    console.log(`Delete ${otid}`);
  };

  return (
    <>
    <Box style={{ display: "flex", alignItems:"center", marginBottom: "50px" }}>
      {/* Add Note Button */}
      <Button
        type="button"
        onClick={handleAddNote}
        variant="contained"
        style={{ marginRight: "10px", width: "150px", height: "55px", marginTop: "5px" }}
      >
        Add Note
      </Button>

      {/* Search Bar */}
      <TextField
        label="Search by Title"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>

      {/* Display OtherCodes as Cards */}
      <Grid container spacing={2}>
        {otherCodes
          .filter((code) =>
            code.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((code) => (
            <Grid item key={code.OTID} xs={12} sm={6} md={4}>
              <Card style={{ backgroundColor: "#E6F7FF" }}>
                <CardContent>
                  <Typography variant="h6">{code.title}</Typography>
                  {/* Add other details as needed */}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleViewEdit(code.OTID)}
                    style={{ marginRight: "5px" }}
                  >
                    View & Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(code.OTID)}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </>
  );
}
