import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import { auth, db, DBState, logout } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import HomeScreen from "../pages/HomeScreen";
import Messages from "../pages/Messages";
import Account from "../pages/Account";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import {
  CircularProgress,
  Avatar,
  Tabs,
  Tab,
  Typography,
  Box,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { Route, Routes, Link } from "react-router-dom";
import Logo from "../logo.svg";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  let multipliers = [0.2126, 0.7152, 0.0722];
  let luminance = 0;

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    luminance += value * multipliers[i];
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */
  return [luminance < 150 ? "white" : "black", color];
}

function stringAvatar(name) {
  let [foreground, background] = stringToColor(name);
  return {
    sx: {
      bgcolor: background,
      color: foreground,
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

function checkPathValue() {
  const { pathname } = window.location;
  if (pathname === "/dashboard") return false;
  return pathname;
}

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const confirmDB = useRecoilValue(DBState);
  const navigate = useNavigate();
  const fetchUserName = useCallback(async () => {
    try {
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (!docSnap.exists()) {
        throw new Error("Cannot find document associated with user");
      }
      const data = docSnap.data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  }, [user, navigate]);
  const [fetchingUserName, setFetchingUserName] = useState(true);
  const [value, setValue] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    // if we don't know the database is prepared yet, keep waiting
    if (!confirmDB) return;
    // fetch user name after we are sure the user exists
    fetchUserName().then(() => setFetchingUserName(false));
    setValue(checkPathValue());
  }, [loading, user, navigate, confirmDB, setValue, fetchUserName]);
  return fetchingUserName ? (
    <div className="middle">
      <CircularProgress />
    </div>
  ) : (
    <>
      <div className="Banner__banner">
        <img
          className="Banner__logo"
          onClick={() => navigate("/dashboard")}
          alt="logo"
          src={Logo}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Tabs value={value} aria-label="basic tabs example" centered>
            <Tab
              label="View Schedule"
              value="/dashboard/view_schedule"
              to="/dashboard/view_schedule"
              component={Link}
            />
            <Tab
              label="Edit Schedule"
              value="/dashboard/edit_schedule"
              to="/dashboard/edit_schedule"
              component={Link}
            />
            <Tab
              label="Messages"
              value="/dashboard/messages"
              to="/dashboard/messages"
              component={Link}
            />
            <Tab
              label="Account Settings"
              value="/dashboard/account_settings"
              to="/dashboard/account_settings"
              component={Link}
            />
          </Tabs>
        </Box>
        <Avatar
          className="avatar"
          {...stringAvatar(name)}
          onClick={handleOpen}
        />
        <Menu
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Typography
            sx={{
              p: 2,
              color: "#616161",
              lineHeight: "1em",
            }}
          >
            Hello, <b>{name}</b>
          </Typography>
          <Divider />
          <MenuItem onClick={() => navigate("/dashboard/account_settings")}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Account Settings
          </MenuItem>
          <MenuItem onClick={() => logout()}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </div>
      <Routes>
        <Route path="/messages" element={<Messages />} />
        <Route path="/account_settings" element={<Account />} />
        <Route path="/*" element={<HomeScreen />} />
      </Routes>
    </>
  );
}
export default Dashboard;
