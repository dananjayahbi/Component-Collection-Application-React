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
import ViewAndUpdateLearningNode from "./ViewAndUpdateLearningNode";
import DeleteLearningNode from "./DeleteLearningNode";

export default function LearnNodes() {
  const [learningNodes, setLearningNodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [openPopupVNULNode, setOpenPopupVNULNode] = useState(false);
  const [openPopupDeleteLearningNode, setOpenPopupDeleteLearningNode] =
    useState(false);
  const [FetchedLearningNode, setFetchedLearningNode] = useState(null);

  useEffect(() => {
    // Fetch data from the backend API
    fetch("http://localhost:8070/learningNodes/getAllLearningNode")
      .then((response) => response.json())
      .then((data) => setLearningNodes(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleAddNode = () => {
    navigate("/addLearningNode");
  };

  const handleViewEdit = (data) => {
    setFetchedLearningNode(data);
    setOpenPopupVNULNode(true);
  };

  const handleDelete = (data) => {
    setFetchedLearningNode(data);
    setOpenPopupDeleteLearningNode(true);
  };

  return (
    <>
      <Typography variant="h5" style={{ marginBottom: "20px" }}>
        Learning Nodes
      </Typography>
      <Divider style={{ marginBottom: "20px" }} />
      <Box
        style={{ display: "flex", alignItems: "center", marginBottom: "50px" }}
      >
        {/* Add Note Button */}
        <Button
          type="button"
          onClick={handleAddNode}
          variant="contained"
          style={{
            marginRight: "10px",
            width: "150px",
            height: "55px",
            marginTop: "5px",
          }}
        >
          Add Node
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

      {/* Display LearningNodes as Cards */}
      <Grid container spacing={2}>
        {learningNodes
          .filter((node) =>
            node.title?.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((node) => (
            <Grid item key={node.OTID} xs={12} sm={6} md={4}>
              <Card style={{ backgroundColor: "#E0E8FC" }}>
                <CardContent>
                  <Typography variant="h6">{node.title}</Typography> <br />
                  {/* Add other details as needed */}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleViewEdit(node)}
                    style={{ marginRight: "5px" }}
                  >
                    View & Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(node)}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      <ViewAndUpdateLearningNode
        openPopupVNULNode={openPopupVNULNode}
        setOpenPopupVNULNode={setOpenPopupVNULNode}
        learningNodeData={FetchedLearningNode}
      ></ViewAndUpdateLearningNode>
      <DeleteLearningNode
        openPopupDeleteLearningNode={openPopupDeleteLearningNode}
        setOpenPopupDeleteLearningNode={setOpenPopupDeleteLearningNode}
        learningNodeData={FetchedLearningNode}
      ></DeleteLearningNode>
    </>
  );
}
