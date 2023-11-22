import React, { useState } from "react";
import {
  Button,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import Notification from "../../components/Notification";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

//The Main function
export default function DeleteLearningNode(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const fetchedLearningNode = props.learningNodeData;
  const { openPopupDeleteLearningNode, setOpenPopupDeleteLearningNode } = props;

  console.log(props);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8070/learningNodes/deleteLearningNode/${fetchedLearningNode._id}`
      );
      sessionStorage.setItem("NodeDeleted", "1");
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setOpenPopupDeleteLearningNode(false);
    }
  };

  return (
    <Dialog
      open={openPopupDeleteLearningNode}
      onBackdropClick={() => setOpenPopupDeleteLearningNode(false)}
      maxWidth="sm"
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          borderRadius: 10,
          width: "25%",
          padding: "20px",
          paddingBottom: "30px",
        },
      }}
    >
      <div className="popup">
        <DialogTitle>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <p className="popupTitle">Delete Node?</p>
            </div>
          </div>

          {/* NOTIFICATION */}
          <Notification notify={notify} setNotify={setNotify} />

          <Divider
            sx={{
              height: "1px",
              backgroundColor: "var(--dark)",
              marginTop: "10px",
            }}
          />
        </DialogTitle>

        <DialogContent style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="button"
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogContent>
      </div>
    </Dialog>
  );
}
