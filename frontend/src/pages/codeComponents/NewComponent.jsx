import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  IconButton,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Notification from "../../components/Notification";
import MonacoEditor from 'react-monaco-editor';
import { useNavigate } from "react-router-dom";


export default function NewComponent() {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const [categories, setCategories] = useState([]);
  const [IMGURL, setIMGURL] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    formik.handleChange(event);
    setIMGURL(event.target.value);
  };

  const handleBlur = (event) => {
    formik.handleBlur(event);
    setIMGURL(event.target.value);
  };

  const handleCodeFieldChange = (value, index) => {
    const updatedCodes = [...formik.values.codes];
    updatedCodes[index].code = value;
  
    formik.handleChange({
      target: {
        name: `codes[${index}].code`,
        value: updatedCodes[index].code,
      },
    });
  };

  const formik = useFormik({
    initialValues: {
      componentName: "",
      category: "",
      imageURL: "",
      description: "",
      notes: "",
      codes: [{ language: "", code: "", notes: "" }],
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:8070/Components/addComponent",
          values
        );

        if (response.status === 200) {
          sessionStorage.setItem("componentAdded", "1");
          window.location.reload();
        } else {
          setNotify({
            isOpen: true,
            message: "Adding Component Failed!",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error adding component:", error);
      }
    },
  });

  const addCodeField = () => {
    formik.setValues({
      ...formik.values,
      codes: [...formik.values.codes, { language: "", code: "" }],
    });
  };

  const removeCodeField = (index) => {
    const updatedCodes = [...formik.values.codes];
    updatedCodes.splice(index, 1);
    formik.setValues({
      ...formik.values,
      codes: updatedCodes,
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8070/Categories/getAllCategories"
        );

        if (response.status === 200) {
          setCategories(response.data.map((category) => category.categoryName));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Box p={1}>
      <Notification notify={notify} setNotify={setNotify} />
      <form onSubmit={formik.handleSubmit}>
        <Box>
          <Typography variant="h5">Add Component</Typography>
          <Divider sx={{ mt: 2, mb: 2.5 }} />
        </Box>

        {/* Your Formik form fields */}
        <TextField
          label="Component Name"
          fullWidth
          margin="normal"
          name="componentName"
          value={formik.values.componentName}
          onChange={formik.handleChange}
        />

        {/* Category Dropdown */}
        <TextField
          select
          label="Category"
          fullWidth
          margin="normal"
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>

        <Box style={{padding: " 20px 20px 20px 20px",marginTop:"40px", display:"flex",flexDirection:"column",alignItems:"center", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",}}>
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            You can paste any image link in the "Image URL" field. You can use the following links to navigate to some places that you can upload images.
          </Typography>
          <Box style={{display:"flex", paddingTop:"40px", paddingBottom:"30px"}}>
            <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZKYpfs-1Dx8ZUFLU5EvHtdUwE4bbb8S1cGg&usqp=CAU" alt="Pinterest" width="50px" />
            </a> &nbsp;&nbsp;
            <a href="https://www.flickr.com" target="_blank" rel="noopener noreferrer">
              <img src="data:image/png;base64,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" alt="Pinterest" width="50px" />
            </a> &nbsp;&nbsp;
            <a href="https://www.google.com/drive" target="_blank" rel="noopener noreferrer">
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABcVBMVEX/////ugAmhPwArEcAZtoAgy3qQzUAfPzU4v4YgPyHsv0ArzwAZN3/vwAAgLLpPjbxcykAgSdLmFz/tgAAqT0AqkAAXdgAgC4ApzYAgCUAqUW/5sz/787/9uLpNSMAV9f/1Hf/5Kz2/fr/wjIAjDMAmzz/0Gr/xkB9zZf/67//++/j9er/8tbQ7dr/243sQjDwPyEPbuNYeNn2ubW/2sWEvJNYpG3K4dAAfBc+qF+WrVKl3LfytgCppBc5iyfTrwxtlSFiw4GYnxs3uGSloxid2bLIrBH/4J9PkCTjtAmImx5Pv3b/yVCO1adhkyPK7Ne5qBUhix7N2p7/1oCG0J4/umpxyY7N5O3waxL85NuKZa7t9v3WSkz+8/Jpmea7V3jwhX60zfJLe+GgYZmXt+z0p6LrUkbPTl3tZlw8fup3b8HHUmmuXInxjoeMaKrsXFH4y8hPiuLvdW2Grerzop1BhOCzWoSqy/5ppvw+jfzE2v7N0iWCAAAHXElEQVR4nO2c/XsTRRSFd2eVttqqJQ1JLQ0lWCiEkIKlRouFEisi1KoFqsSvolaL36IW+OvNNtlNdne+7uzMzvA89/2Zne55zuSe2ZMNnocgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCILIUF+5unpczOrVlYbtW1XindV2e3Z2dlpE79+028dXbN8umMa77dmX5Zltv3fR9i3DWJt5E6Cvx/S10i3bNw1hqRoEixCBlfd9v7Rg+7blCQUGwVsAhetT/oskce1IYADYp5XrfkjptO1bl6MxE/SRNrFyY8rvM2/75qXYKA8Uypt4eyCwdNb2zcuwXQ0iFiUtvBlZ6JfO2759CTrlWGEgp3DdH3LO9u2LWRtaKGli5dMRhe4Pm/qIg5LDZn3KH5VoW4GIpZmEQolhU7ntJxTu2JbAp5EUKGFi5YafpOR2YmyUUwrFJl5LK3Q6MeaqQZpFgYUf+GmcToxO2kJhYqxnBPr+Gdsy2GxmLRSYWPmQotDd56h6esyIh81HUxSFfumCbSkMHtAVcoZNKilcHzZNukDOPq18TBXYk+hmpXGHMmb4Jk6nkyJWeNe2GBqUpBCYGFYXLIkuJgZTH3PY0JIiYsq2nCxbrE8hc59SkyI28ZJtQWnqrA8h08TKJxyBDiZG5kAqNpE1ZgYKHUuMbd4eDckMm8pNrsCexJO2RSW4z7cwyB5PmUkR41ShscZOCoaJieqCYaJLhYbQwSA9bNapB9IUtmUNuSf6FIYkhs2g5BaY6Eyh0ZCxMGFiprpg4EqhIUgKionT9GeKjImOJMaczB4NiYeNMCliiW4kBq26oBOPGUmBjhQaEkmRMlEiKWITHUgMRnVBpz9s6NUFA9v6MiU3n6Nhw6guGCYu2BYomRQjJjKrCwa2Cw1mdcE0UXwgTZpoudDgVBd0Fiklt0Ci3UKjAxQYBJ8BBVouNKglN5fq5yWoQpsVOHDM9ChveGfBEn17hQYoKfoKG948WKC9xGiC9+jMVu+yHfg+tZUYwKQIqfcuuwA30VJigJMiqK4dXXgabqKdxAAbWO4MrjwDdtHK8ZRbctMtbA4uPflCJAY8KWYexBcrJEbxhcYG2MJg+L66QmIUXmgoJkXEJfg+LbrQkK8uYuqj10MegvsUXIEDqosB1bnEAufhJhZbaIANLN9PrXAObGKhiSFVcictbKaWuAg3scAvTRWSYimzyILLiSFZco+S/WWTwvG0sMTYhifFJmWZW+4mRgfsYEBdB54YBVXguZMiwtXEELx1QaG8wVjqLnzYFKFQobpIJ0XEvJOJ0czzTJEGXmgUkBiK1QUdFxNDubqgo5AYpgsNsIGMpIiAfYkRYjgxtuAWbnMXVCg0jCZGA2wgMykiHKvAGW9y8xSKfmqvUGgYfM1Gobq4J1xUoQI3lxji9/MysJMiwqUKXHNSRLhTgdfBBgYd8aqeSqFhKDFylNx8XKnAc5XcfBxJDHjJLUyKCDcSI2fJzUehAtefGAE8KQCrw03UXoFrqy7oKBQamhMDnhSZkpsPvNDQnBgaSm4+thMj8yN0IdJJEaFQgetMDHjJXRYfSJMoHE81JkYdPmZoJTcfeGJoNHET/o22wl+Bm6jvaR/81ARKigjwsNHYu0EFlu8o/RlwYmh7LxM8SZklNx/wl6ba/qeX5qtAsl+HyrHjT4HQVoDvvgbkFUWevAHjiy81KRw/NQlibEKVh8uvQ6jpUtg98RIIos5XrWMAal9rUujBBE7kUHhlGaLwmC6B3jeTAIGXcwgk5FuAia3vtCncg2zTXALJI4DC2p/aFHqXi7KQkO/l92lLn0DvB3kTcwokRN7CHzUq7B7ICswzZvo8ljSxta9tkoZIfxJzCyTkJ7mPYu1tnQI971+5capBoGRitH7WK7B3rpERmHfM9PmvJqFwWdd5JkYqE7UIJAcS21RjFkZ0JRTqsVAqMfQd2IZIJIYmgYTsi1zUmhQxwsTInxQRosRo7ZsQKEwMXXs05Be+iTrPa6MIEkOjQHKFO061J0XELjcxdFpIyK88idqefDM84e1TrQIJ4WzT2m+mBHrdwiwk5Hf2sGkZSIoITmJoFsgpNHQfSJM8Yg0b7QKZidH6w6RA7zlj2OjeoyGMQsNUUkT8RTfRgEBGodH626xARrNowkJGYphLighqYhgRSE2M2j+mBXpdSitlxkJCHmaHjd7qgs5hxkRTAimFhtmkiMgcT/U9U6RJFxqGkyIiXWiYszCTGPqrCzqpQsOgwFShYaC6oJMsNExamCo0TB5IkySOp0YFJgqNApIiYrQCNzdm+gyPp4aqCzrDQsPsHg2JE8P0gTRJnBjGBcaJYay6oLN7oigL4wrcREPKY+9UQRb2EuPIxOVCTjOjHM3TIizsFxpmKmCRxMlCLCRhoVHMeTTN+MFYQQof7xc6Rkc4nBgzHYeETIyRQ0v6QvaePuvdgjkmyLOnzy3qO6I7bpKubXkIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgoD4H++dQi4A1J0LAAAAAElFTkSuQmCC" alt="Pinterest" width="50px" />
            </a>
          </Box>
        </Box>

        <TextField
          label="Image URL"
          fullWidth
          margin="normal"
          name="imageURL"
          value={formik.values.imageURL}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {/* Display Image Box */}
        {IMGURL && (
          <Box>
            <Typography variant="h6" style={{ marginTop: "20px" }}>
              Image Preview
            </Typography>
            <img src={IMGURL} alt="&nbsp;&nbsp;invalid URL" style={{ maxWidth: "100%" }} />
          </Box>
        )}

        <TextField
          label="Description"
          fullWidth
          margin="normal"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          multiline
          minRows={6}
        />

        <TextField
          label="Notes"
          fullWidth
          margin="normal"
          name="notes"
          value={formik.values.notes}
          onChange={formik.handleChange}
          multiline
          minRows={6}
        />

        <Typography variant="h6" style={{ marginTop:"20px" }}>Code Inputs</Typography>
        <Divider sx={{ mt: 2, mb: 2.5 }} />

        {/* Codes Fields */}
        {formik.values.codes.map((codeField, index) => (
          <Box 
            key={index} 
            display="flex" 
            flexDirection="column"
            style={{
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              padding:"20px",
              marginTop:"20px",
              marginBottom:"25px"
            }}
          >
            <TextField
              select
              label="Language"
              margin="normal"
              name={`codes[${index}].language`}
              value={codeField.language}
              onChange={formik.handleChange}
              style={{ marginRight: '5px', width:"300px"}}
            >
              <MenuItem value="HTML">HTML</MenuItem>
              <MenuItem value="CSS">CSS</MenuItem>
              <MenuItem value="JavaScript">JavaScript</MenuItem>
              <MenuItem value="PHP">PHP</MenuItem>
              <MenuItem value="MySQL">MySQL</MenuItem>
              <MenuItem value="React">React</MenuItem>
              <MenuItem value="NodeJS">NodeJS</MenuItem>
              <MenuItem value="TypeScript">TypeScript</MenuItem>
              <MenuItem value="JSON">JSON</MenuItem>
            </TextField>

            <MonacoEditor
              height="1000"
              name={`codes[${index}].code`}
              language="javascript"
              theme="vs-dark"
              value={codeField.code}
              options={{ 
                selectOnLineNumbers: true,
                automaticLayout: true,
                padding: { top: 20, bottom: 20 },
              }}
              onChange={(value) => handleCodeFieldChange(value, index)}
            />

            <TextField
              label="Notes"
              margin="normal"
              name={`codes[${index}].notes`}
              value={codeField.notes}
              onChange={formik.handleChange}
              multiline
              minRows={7}
            />

            {/* Remove Code Field Button */}
            <IconButton
              type="button"
              onClick={() => removeCodeField(index)}
              size="small"
              color="error"
              style={{ width:"35px", marginLeft: "auto"}}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        {/* Add Code Field Button */}
        <Button type="button" onClick={addCodeField} variant="outlined" style={{ marginRight: "10px"}}>
          Add Code Field
        </Button>

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </Box>
  );
}
