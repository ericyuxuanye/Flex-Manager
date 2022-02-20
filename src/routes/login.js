import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import "./login.css";
import google from "../google.svg";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const linkStyle = {
    textDecoration: "none",
  };
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard");
  });
  return (
    <div className="middle">
      {/*replace with logo*/}
      <h1 className="title1">Flex Scheduler</h1>
      <div className="container">
        <h2 className="title2">Log In</h2>
        <TextField
          className="textBox"
          id="email-textfield"
          label="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="dense"
        />
        <TextField
          className="textBox"
          id="password-textfield"
          label="password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          margin="dense"
        />
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              onChange={(e) =>
                setRemember(e.target.value === "unchecked" ? false : true)
              }
            />
          }
          label="Remember me"
        />
        <button
          className="btn login__btn gradient__btn"
          onClick={() => logInWithEmailAndPassword(email, password, remember)}
        >
          Login
        </button>
        <button className="btn login__google" onClick={signInWithGoogle}>
          <img id="google_image" src={google} alt="google" />
          Login with Google
        </button>
        <div>
          <Link to="/reset" style={linkStyle}>
            Forgot Password
          </Link>
        </div>
        <div>
          Don't have an account?{" "}
          <Link to="/register" style={linkStyle}>
            Register
          </Link>{" "}
          now.
        </div>
      </div>
    </div>
  );
}
export default Login;
