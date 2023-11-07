import React, { useState } from "react";
import { Link } from "react-router-dom";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import "../css/NavBar.css";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="items">
          <div className="item">
            <ClickAwayListener onClickAway={handleCloseMenu}>
              <div onClick={handleOpenMenu}>
                <Avatar
                  src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                  alt=""
                  className="avatar"
                />
              </div>
            </ClickAwayListener>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem
                component={Link}
                to="/profile"
                onClick={handleCloseMenu}
              >
                Profile
              </MenuItem>
              <MenuItem
                component={Link}
                to="/settings"
                onClick={handleCloseMenu}
              >
                Settings
              </MenuItem>
              <MenuItem
                component={Link}
                to="/logout"
                onClick={handleCloseMenu}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
