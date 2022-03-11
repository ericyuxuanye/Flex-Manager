import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { getDoc, doc } from "firebase/firestore";
import Button from "../Button";
import "./Account.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, getDefaultClass } from "../firebase";

function Account(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [defaultClass, setDefaultClass] = useState("");
  const [currentDefaultClass, setCurrentDefaultClass] = useState("")
  const fetchDefaultClass = async () => {
    try {
      const docSnap = await getDoc(doc(db, "users", props.user.uid));
      if (!docSnap.exists()) {
        throw new Error("Cannot find document associated with user");
      }
      const data = docSnap.data();
      setCurrentDefaultClass(data.defaultClass)
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching user data");
    }
  };
  fetchDefaultClass();
  return (
    <div className="Account__panel">
      <h1 className="Account__center">Account Settings</h1>
      <h2 className="Account__center Account__lightgray">
        Below, you can change your default class or reset your password
      </h2>
      <section className="container Account__container">
        <h2 className="Account__center">Default Class</h2>
        <p className="Account__lightgray">Current: {currentDefaultClass}</p>
        <div className="Account__flex-row">
          <TextField
            type="number"
            label="Default Class"
            className="textBox"
            onChange={(e) => setDefaultClass(e.target.valueAsNumber)}
            inputProps={{
              onInput: (e) =>
                (e.target.value = e.target.value.replace(/(?![0-9])./gim, "")),
            }}
            value={defaultClass}
          />
          <Button className="gradient__btn submit__btn">Submit</Button>
        </div>
      </section>
      <section className="container Account__container">
        <h2 className="center">Reset Password</h2>
        <div className="Account__flex-row">
          <TextField
            id="new-password-textfield"
            label="New Password"
            value={password}
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ backgroundColor: "white", mr: 1 }}
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
          <Button className="gradient__btn reset__btn">Reset</Button>
        </div>
      </section>
    </div>
  );
}

export default Account;
