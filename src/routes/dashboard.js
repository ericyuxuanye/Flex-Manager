import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import "./dashboard.css";
import { auth, db, DBState, logout } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import HomeScreen from "../pages/HomeScreen";
import {
  CircularProgress,
  Avatar,
  Tabs,
  Tab,
  Typography,
  Box,
  Popover,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { Route, Routes, Link } from "react-router-dom";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
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
  const [defaultClass, setDefaultClass] = useState(NaN);
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
      setDefaultClass(data.defaultClass);
      if (defaultClass === undefined) navigate("/setRoom");
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  }, [user, defaultClass, navigate]);
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
    <div>
      <div className="Banner__banner">
        <div className="Banner__logo" onClick={(e) => navigate("/dashboard")}>
        </div>
        <div className="Banner__spacer"></div>
        <Box sx={{ flexGrow: 1 }}>
          <Tabs value={value} aria-label="basic tabs example" centered>
            <Tab
              label="Link1"
              value="/dashboard/link1"
              to="/dashboard/link1"
              component={Link}
            />
            <Tab
              label="Link2"
              value="/dashboard/link2"
              to="/dashboard/link2"
              component={Link}
            />
            <Tab
              label="Link3"
              value="/dashboard/link3"
              to="/dashboard/link3"
              component={Link}
            />
            <Tab
              label="Link4"
              value="/dashboard/link4"
              to="/dashboard/link4"
              component={Link}
            />
            <Tab
              label="Link5"
              value="/dashboard/link5"
              to="/dashboard/link5"
              component={Link}
            />
            <Tab
              label="Link6"
              value="/dashboard/link6"
              to="/dashboard/link6"
              component={Link}
            />
          </Tabs>
        </Box>
        <Avatar
          className="avatar"
          {...stringAvatar(name)}
          onClick={handleOpen}
        />
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Typography sx={{ p: 2 }}>
            <p>Hello, {name}</p>
            <p>Default class: {defaultClass}</p>
          </Typography>
        </Popover>
      </div>
      <Routes>
        <Route
          path="/*"
          element={<HomeScreen name={name} defaultClass={defaultClass} />}
        />
      </Routes>
    </div>
  );
}
export default Dashboard;
