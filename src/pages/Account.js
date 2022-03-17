import React, { useState, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import Button from "../Button";
import "./Account.css";
import {
  getAvailableClasses,
  setUserPassword,
  getUserClasses,
  setUserClasses,
} from "../firebase";

function Account() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [classes, setClasses] = useState([]);
  // fetch classes and selected classes once
  useEffect(() => {
    (async () => {
      const docs = await getAvailableClasses();
      setClasses(docs.map((d) => d.id));
    })();
    (async () => setSelectedClasses(await getUserClasses()))();
  }, []);
  return (
    <div className="Account__panel">
      <h1 className="Account__center">Account Settings</h1>
      <h2 className="Account__center Account__lightgray">
        Below, you can set your favorite classes or reset your password
      </h2>
      <section className="container Account__container">
        <h2 className="Account__center">Favorite Classes</h2>
        <div className="Account__flex-row">
          <Autocomplete
            multiple
            id="tags-outlined"
            options={classes}
            value={selectedClasses}
            filterSelectedOptions
            fullWidth
            sx={{ backgroundColor: "white", mt: 1, mb: 2 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Classes"
                placeholder="Class"
                type="text"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password'
                }}
              />
            )}
            onChange={(_, newValue) => {
              setSelectedClasses(newValue);
            }}
          />
        </div>
        <div className="Account__flex-row">
          <Button
            className="gradient__btn submit__btn"
            onClick={() => {
              setUserClasses(selectedClasses);
            }}
          >
            Submit
          </Button>
        </div>
      </section>
      <section className="container Account__container">
        <h2 className="center">Reset Password</h2>
        <div className="Account__flex-row">
          <TextField
            id="old-password-textfield"
            label="Old Password"
            value={oldPassword}
            type={showOldPassword ? "text" : "password"}
            onChange={(e) => setOldPassword(e.target.value)}
            sx={{ backgroundColor: "white", mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={(_) => setShowOldPassword(!showOldPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="Account__flex-row">
          <TextField
            id="new-password-textfield"
            label="New Password"
            value={password}
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ backgroundColor: "white", mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={(_) => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="Account__flex-row">
          <Button
            className="gradient__btn reset__btn"
            onClick={() => setUserPassword(oldPassword, password)}
          >
            Reset
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Account;
