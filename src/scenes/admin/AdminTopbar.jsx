import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import logo from "../../assets/zaga-logedit.jpg";
import { Navigate, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
const AdminTopbar = () => {
  const navigate = useNavigate();
  const handleHomepage = () => {
    navigate("/");
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "50px",

            backgroundColor: "#00888C",
          }}
        >
          <Box style={{ margin: "15px 20px 10px 0px", display: "flex" }}>
            <img
              src={logo}
              alt="Logo"
              style={{
                // width: "90px",
                // height: "37px",
                width: "180px",
                height: "60px",
                marginRight: "20px",
              }}
            />

            {/* <Box style={{ margin: "8px 10px -8px 33px" }}>
              <img
                src={logo}
                alt="Logo"
                style={{
                  // width: "180px",x
                  // height: "60px",
                  width: "180px",
                  height: "60px",
                }}
              />
            </Box> */}

            <Typography
              sx={{
                color: "#FFF",
                borderLeft: "4px solid white",
                paddingLeft: "20px",
                fontWeight: "bold",
                paddingTop:"15  px"
              }}
              variant="h3"
              fontWeight="500"
              marginLeft={1}
            >
              Cluster Management
            </Typography>
          </Box>

          <div style={{ marginLeft: "5px", marginTop: "5px" }}>
            <span style={{ color: "white" }}>Home</span>
            <IconButton aria-label="Account" onClick={handleHomepage}>
              <HomeIcon
                style={{ fontSize: "20px", color: "#FFF", marginBottom: "5px" }}
              />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default AdminTopbar;
