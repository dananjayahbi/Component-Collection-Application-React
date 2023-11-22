import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import LanguageIcon from "@mui/icons-material/Language";
import StorageIcon from "@mui/icons-material/Storage";
import SidebarLinkGroup from "./SidebarLinkGroup";
import axios from "axios";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ConstructionIcon from "@mui/icons-material/Construction";
import ConnectedTvIcon from "@mui/icons-material/ConnectedTv";
import AirlineStopsIcon from "@mui/icons-material/AirlineStops";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  const token = window.localStorage.getItem("token");
  const [loggedInUserDetails, setLoggedInUserDetails] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [pagePermissions, setPagePermissions] = useState([]);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  //Getting Loggen In user's details
  async function getUserDetails(token) {
    await axios
      .get(`http://localhost:8070/users/getUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoggedInUserDetails(res.data);
      });
  }

  //checking role page access
  const pageAccess = async (roleName) => {
    try {
      if (roleName != null) {
        const response = await fetch(
          "http://localhost:8070/rolesPermissions/getAllPagePermissionsForRole",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              roleName,
            }),
          }
        );

        const data = await response.json();
        setPagePermissions(data.pagePermissions);
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    getUserDetails(token);
    pageAccess(loggedInUserDetails.role);
  }, [loggedInUserDetails]);

  function checkPageAccess(pageName) {
    const pagePermission = pagePermissions.find(
      (permission) => permission.page === pageName
    );
    //console.log(pagePermission)
    console.log();

    if (pagePermission) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-64 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/" className="block">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <defs>
                <linearGradient
                  x1="28.538%"
                  y1="20.229%"
                  x2="100%"
                  y2="108.156%"
                  id="logo-a"
                >
                  <stop stopColor="#A5B4FC" stopOpacity="0" offset="0%" />
                  <stop stopColor="#A5B4FC" offset="100%" />
                </linearGradient>
                <linearGradient
                  x1="88.638%"
                  y1="29.267%"
                  x2="22.42%"
                  y2="100%"
                  id="logo-b"
                >
                  <stop stopColor="#38BDF8" stopOpacity="0" offset="0%" />
                  <stop stopColor="#38BDF8" offset="100%" />
                </linearGradient>
              </defs>
              <rect fill="#6366F1" width="32" height="32" rx="16" />
              <path
                d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z"
                fill="#4F46E5"
              />
              <path
                d="M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z"
                fill="url(#logo-a)"
              />
              <path
                d="M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z"
                fill="url(#logo-b)"
              />
            </svg>
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span
                className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                aria-hidden="true"
              >
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                Pages
              </span>
            </h3>
            <ul className="mt-3">
              {/* Dashboard */}
              <SidebarLinkGroup
                activecondition={
                  pathname === "/" || pathname.includes("dashboard")
                }
              >
                {() => {
                  return (
                    <React.Fragment>
                      <a
                        href="/"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          pathname === "/" || pathname.includes("dashboard")
                            ? "hover:text-slate-200"
                            : "hover:text-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <SpaceDashboardIcon />
                          <div className="flex items-center">
                            <span className="text-sm font-medium mr-24 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Dashboard
                            </span>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block"></div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* Fiverr Projects */}
              <SidebarLinkGroup
                activecondition={pathname.includes("fiverrProjects")}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          pathname.includes("reports")
                            ? "hover:text-slate-200"
                            : "hover:text-white"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <AccountTreeIcon />
                            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Manage
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                open && "rotate-180"
                              }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                          {checkPageAccess("All Admin Permissions") ? (
                            <li className="mb-1 last:mb-0">
                              <NavLink
                                end
                                to="/NewComponent"
                                className={({ isActive }) =>
                                  "block transition duration-150 truncate " +
                                  (isActive
                                    ? "text-indigo-500"
                                    : "text-slate-400 hover:text-slate-200")
                                }
                              >
                                <ConstructionIcon
                                  sx={{ fontSize: 15, marginRight: "5px" }}
                                />
                                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  New Component
                                </span>
                              </NavLink>
                            </li>
                          ) : null}

                          {checkPageAccess("All Admin Permissions") ? (
                            <li className="mb-1 last:mb-0">
                              <NavLink
                                end
                                to="/learningNodes"
                                className={({ isActive }) =>
                                  "block transition duration-150 truncate " +
                                  (isActive
                                    ? "text-indigo-500"
                                    : "text-slate-400 hover:text-slate-200")
                                }
                              >
                                <LightbulbIcon
                                  sx={{ fontSize: 15, marginRight: "5px" }}
                                />
                                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  Learning Nodes
                                </span>
                              </NavLink>
                            </li>
                          ) : null}

                          {checkPageAccess("All Admin Permissions") ? (
                            <li className="mb-1 last:mb-0">
                              <NavLink
                                end
                                to="/CMCategories"
                                className={({ isActive }) =>
                                  "block transition duration-150 truncate " +
                                  (isActive
                                    ? "text-indigo-500"
                                    : "text-slate-400 hover:text-slate-200")
                                }
                              >
                                <AirlineStopsIcon
                                  sx={{ fontSize: 15, marginRight: "5px" }}
                                />
                                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  CM Categories
                                </span>
                              </NavLink>
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* Users */}
              <SidebarLinkGroup activecondition={pathname.includes("users")}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          pathname.includes("users")
                            ? "hover:text-slate-200"
                            : "hover:text-white"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <PeopleAltIcon />
                            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Employees
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                open && "rotate-180"
                              }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                          {checkPageAccess("Users List") ? (
                            <li className="mb-1 last:mb-0">
                              <NavLink
                                end
                                to="/users/usersList"
                                className={({ isActive }) =>
                                  "block transition duration-150 truncate " +
                                  (isActive
                                    ? "text-indigo-500"
                                    : "text-slate-400 hover:text-slate-200")
                                }
                              >
                                <FormatListBulletedIcon
                                  sx={{ fontSize: 15, marginRight: "5px" }}
                                />
                                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  Employees List
                                </span>
                              </NavLink>
                            </li>
                          ) : null}

                          {checkPageAccess("Roles List") ? (
                            <li className="mb-1 last:mb-0">
                              <NavLink
                                end
                                to="/users/rolesList"
                                className={({ isActive }) =>
                                  "block transition duration-150 truncate " +
                                  (isActive
                                    ? "text-indigo-500"
                                    : "text-slate-400 hover:text-slate-200")
                                }
                              >
                                <FormatListBulletedIcon
                                  sx={{ fontSize: 15, marginRight: "5px" }}
                                />
                                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  Roles List
                                </span>
                              </NavLink>
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
            </ul>
          </div>

          {/* More group */}
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span
                className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                aria-hidden="true"
              >
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                More
              </span>
            </h3>
            <ul className="mt-3">
              {/* Settings */}
              <SidebarLinkGroup activecondition={pathname.includes("settings")}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          pathname.includes("settings")
                            ? "hover:text-slate-200"
                            : "hover:text-white"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <SettingsIcon />
                            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Settings
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                open && "rotate-180"
                              }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                          {checkPageAccess("All Admin Permissions") ? (
                            <li className="mb-1 last:mb-0">
                              <NavLink
                                end
                                to="/settings/siteSettings"
                                className={({ isActive }) =>
                                  "block transition duration-150 truncate " +
                                  (isActive
                                    ? "text-indigo-500"
                                    : "text-slate-400 hover:text-slate-200")
                                }
                              >
                                <LanguageIcon
                                  sx={{ fontSize: 15, marginRight: "5px" }}
                                />
                                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  Site Settings
                                </span>
                              </NavLink>
                            </li>
                          ) : null}

                          {checkPageAccess("All Admin Permissions") ? (
                            <li className="mb-1 last:mb-0">
                              <NavLink
                                end
                                to="/settings/databaseBackup"
                                className={({ isActive }) =>
                                  "block transition duration-150 truncate " +
                                  (isActive
                                    ? "text-indigo-500"
                                    : "text-slate-400 hover:text-slate-200")
                                }
                              >
                                <StorageIcon
                                  sx={{ fontSize: 15, marginRight: "5px" }}
                                />
                                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  Database Backup
                                </span>
                              </NavLink>
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg
                className="w-6 h-6 fill-current sidebar-expanded:rotate-180"
                viewBox="0 0 24 24"
              >
                <path
                  className="text-slate-400"
                  d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
