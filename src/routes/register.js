import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../firebase";
import google from "../google.svg";
import Button from "../Button";
import "./register.css";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [missingName, setMissingName] = useState(false);
  const history = useNavigate();
  const register = () => {
    if (!name) {
      setMissingName(true);
      return;
    }
    setMissingName(false);
    registerWithEmailAndPassword(name, email, password);
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
          error={missingName}
          helperText={missingName ? "Please Enter Name" : ""}
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
          id="password-textfield"
          label="Password"
          value={password}
          type={showPassword ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          margin="dense"
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
        <Button className="gradient__btn register__btn" onClick={register}>
          Register
        </Button>
        <Button className="login__google" onClick={signInWithGoogle}>
          <img id="google_image" src={google} alt="google" />
          Register with Google
        </Button>
        <div>
          Already have an account? <Link to="/">Login</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Register;
