import React, { useState } from 'react';
import "../css/sideBar.css";
import {
  LineStyle,
  Timeline,
  PermIdentity,
  BarChart,
  WorkOutline,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";

export default function Sidebar() {

    const [activeLink, setActiveLink] = useState('');

    const handleLinkClick = (link) => {
      setActiveLink(link);
    };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">CCMS</h3>
          <ul className="sidebarList">

            <NavLink to="/" className={`link ${activeLink === '/' ? 'sidebarListItem active' : 'sidebarListItem default'}`} onClick={() => handleLinkClick('/')}>
            <li className="sidebarListItem">
              <LineStyle className="sidebarIcon" />
              Dashboard
            </li>
            </NavLink>
            <NavLink to="/analytics" className={`link ${activeLink === '/analytics' ? 'sidebarListItem active' : 'sidebarListItem default'}`} onClick={() => handleLinkClick('/analytics')}>
              <li className="sidebarListItem">
                <Timeline className="sidebarIcon" />
                Analytics
              </li>
            </NavLink>
            <NavLink to="/sales" className={`link ${activeLink === '/sales' ? 'sidebarListItem active' : 'sidebarListItem default'}`} onClick={() => handleLinkClick('/sales')}>
              <li className="sidebarListItem">
                <WorkOutline className="sidebarIcon" />
                Sales
              </li>
            </NavLink>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarSecondaryTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <NavLink to="/users" className={`link ${activeLink === '/users' ? 'sidebarListItem active' : 'sidebarListItem default'}`} onClick={() => handleLinkClick('/users')}>
              <li className="sidebarListItem">
                <PermIdentity className="sidebarIcon" />
                Users
              </li>
            </NavLink>
            <NavLink to="/settings" className={`link ${activeLink === '/settings' ? 'sidebarListItem active' : 'sidebarListItem default'}`} onClick={() => handleLinkClick('/settings')}>
              <li className="sidebarListItem">
                <BarChart className="sidebarIcon" />
                Settings
              </li>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
}
