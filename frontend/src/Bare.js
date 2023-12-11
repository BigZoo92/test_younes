import React from "react";
import { Link, useParams } from 'react-router-dom';
import { Toolbar, Typography, Button, Avatar, Box } from "@mui/material";

function Bare() {
  const { userId } = useParams();
  const avatarImageUrl = `/taskMaster.png`;

  return (
    <Toolbar style={{ backgroundColor: '#5F9DF7 ', display: 'flex', justifyContent: 'space-between', padding: "0.5%", position: 'fixed', zIndex: '999', width: '100%', boxSizing: "border-box" }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={avatarImageUrl} alt="Avatar Image" />
        <h2 style={{color: "#161E54"}}>
          TaskMaster
        </h2>
      </div>
      <Box>
        <Button variant="contained" component={Link} to={`/home/${userId}`} style={{ marginLeft: 8, backgroundColor: '#161E54' }}>
          Home
        </Button>
        <Button variant="contained" component={Link} to={`/task/${userId}`} style={{ marginLeft: 8, backgroundColor: '#161E54'  }}>
          Task
        </Button>
        <Button variant="contained" component={Link} to={`/account/${userId}`} style={{ marginLeft: 8, backgroundColor: '#161E54'  }}>
          Account
        </Button>
      </Box>
    </Toolbar>
  );
}

export default Bare;
