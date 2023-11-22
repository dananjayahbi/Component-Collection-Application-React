import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import {
  Typography,
  Button,
  Divider,
} from "@mui/material";

export default function DatabaseBackup() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleBackup = async () => {
    try {
      // Set loading to true to indicate that the backup is in progress
      setLoading(true);

      // Make a request to trigger the backup procedure on the server
      const response = await axios.get('http://localhost:8070/Components/backupImages');

      // Check if the backup was successful based on the server response
      if (response.data.success) {
        // Set the success message received from the server
        setSuccessMessage(response.data.message);
      } else {
        // Set the error message received from the server
        setErrorMessage(response.data.message);
      }

      // Reset loading state after a short delay (you can adjust the delay)
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error triggering backup:', error);

      // Set the error message in case of a network error
      setErrorMessage('Error triggering backup. Please try again.');

      // Reset loading state in case of an error
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h5" style={{ marginBottom: "20px" }}>
        Backups
      </Typography>
      <Divider style={{ marginBottom: "20px" }} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleBackup}
        disabled={loading}
        style={{ position: 'relative' }}
      >
        {loading && (
          <CircularProgress
            style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }}
            size={24}
          />
        )}
        Backup Images of the Components
      </Button>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

    </div>
  );
}
