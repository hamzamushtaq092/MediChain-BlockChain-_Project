import React, { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { MdCancel } from "react-icons/md";

const NewPatientForm = () => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'black',
          boxShadow: 24,
          p: 4
        }}
      >
        <MdCancel
          size={20}
          className="ModalCloseBtn"
          onClick={handleClose}
          style={{ cursor: 'pointer', position: 'absolute', top: 10, right: 10 , color: 'white'}}
        />
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Upload your Reports
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <input type="file" />
        </Typography>
        <Button>Hello</Button>
       
      </Box>
    </Modal>
  );
};

export default NewPatientForm;
