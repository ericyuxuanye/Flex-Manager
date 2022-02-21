import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../firebase";
import google from "../google.svg";
import "./register.css";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const history = useNavigate();
  const register = () => {
    if (!name) alert("Please enter name");
    else registerWithEmailAndPassword(name, email, password);
  };
  useEffect(() => {
    if (loading) return;
    if (user) history("/dashboard");
  }, [user, loading]);
  return (
    <div className="middle">
      {/*replace with logo*/}
      <h1 className="title1">Flex Scheduler</h1>
      <div className="container">
        <h2 className="title2">Register</h2>
        <TextField
          className="textBox"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Full Name"
          margin="dense"
        />
        <TextField
          className="textBox"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="E-mail Address"
          margin="dense"
        />
        <TextField
          className="textBox"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          margin="dense"
        />
        <button className="btn gradient__btn register__btn" onClick={register}>
          Register
        </button>
        <button
          className="btn login__google"
          onClick={signInWithGoogle}
        >
          <img
            id="google_image"
            src={google}
            alt="google"
          />
          Register with Google
        </button>
        <div>
          Already have an account? <Link to="/">Login</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Register;
