import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Card,
  CardContent,
  Grid,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ViewAndUpdateOtherCode from "./ViewAndUpdateOtherCode";
import DeleteOtherCode from "./DeleteOtherCode";

export default function OtherCodes() {
  const [otherCodes, setOtherCodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [openPopupVNU, setOpenPopupVNU] = useState(false);
  const [openPopupDeleteOtherCode, setOpenPopupDeleteOtherCode] = useState(false);
  const [FetchedOtherCode, setFetchedOtherCode] = useState(null);

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

  const handleViewEdit = (data) => {
    setFetchedOtherCode(data);
    setOpenPopupVNU(true);
  };

  const handleDelete = (data) => {
    setFetchedOtherCode(data);
    setOpenPopupDeleteOtherCode(true);
  };

  return (
    <>
      <Typography variant="h5" style={{ marginBottom: "20px" }}>Other Codes</Typography>
      <Divider style={{ marginBottom: "20px" }} />
      <Box
        style={{ display: "flex", alignItems: "center", marginBottom: "50px" }}
      >
        {/* Add Note Button */}
        <Button
          type="button"
          onClick={handleAddNote}
          variant="contained"
          style={{
            marginRight: "10px",
            width: "150px",
            height: "55px",
            marginTop: "5px",
          }}
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
              <Card style={{ backgroundColor: "#E0E8FC" }}>
                <CardContent>
                  <Typography variant="h6">{code.title}</Typography> <br />
                  {/* Add other details as needed */}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleViewEdit(code)}
                    style={{ marginRight: "5px" }}
                  >
                    View & Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(code)}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      <ViewAndUpdateOtherCode
        openPopupVNU={openPopupVNU}
        setOpenPopupVNU={setOpenPopupVNU}
        otherCodeData={FetchedOtherCode}
      ></ViewAndUpdateOtherCode>
      <DeleteOtherCode
        openPopupDeleteOtherCode={openPopupDeleteOtherCode}
        setOpenPopupDeleteOtherCode={setOpenPopupDeleteOtherCode}
        otherCodeData={FetchedOtherCode}
      ></DeleteOtherCode>
    </>
  );
}
