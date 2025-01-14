import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";


function Header() {
  const navigate = useNavigate();
  const {currentUser, logout, register} = useAuth(); 

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        paddingY: 1,
        margin: 0,
        flexGrow: 1,
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
      }}
    >
      <Toolbar>
        <Typography variant="h4" sx={{ flexGrow: 1 }} fontWeight='bold'>
          {currentUser ? `${currentUser.username}'s To-Do List` : "Guest"}
        </Typography>
        <Button
          onClick={logout}
          sx={{
            backgroundColor: "#FFEBEB",
            "&:hover": {
              backgroundColor: "#FFCDCD",
            },
            color: "darkred",
            textTransform: "none", // This will prevent text from being all uppercase
          }}
        >
          Logout
        </Button>
        <Button
          href="/register"
          sx={{
            backgroundColor: "#FFEBEB",
            "&:hover": {
              backgroundColor: "#FFCDCD",
            },
            color: "darkred",
            textTransform: "none", // This will prevent text from being all uppercase
          }}
        >
          Register
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
