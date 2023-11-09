import React from "react";
import {
  Box,
  Typography,
  Divider,
} from "@mui/material";


export default function ManageFProjects() {
  
  return (
    <Box p={1}>
      <Box>
        <Typography variant="h5">Fiverr Projects</Typography>
        <Divider sx={{ mt: 2, mb: 7.5 }} />
      </Box>
    </Box>
  );  
}
