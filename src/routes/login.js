import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./login.css";
import google from "../google.svg";
import Button from "../Button";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
          id="password-textfield"
          label="password"
          value={password}
          type={showPassword ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          margin="dense"
          sx={{ backgroundColor: "white" }}
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
        <FormControlLabel
          control={<Checkbox onChange={(_, checked) => setRemember(checked)} />}
          label="Remember me"
        />
        <Button
          className="gradient__btn login__btn"
          onClick={() => logInWithEmailAndPassword(email, password, remember)}
        >
          Login
        </Button>
        <Button
          className="login__google"
          onClick={() => signInWithGoogle(remember)}
        >
          <img id="google_image" src={google} alt="google" />
          &nbsp;Login with Google
        </Button>
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
