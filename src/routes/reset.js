import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../firebase";
import TextField from "@mui/material/TextField"
import Button from "../Button";
import "./reset.css";
function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  });
  return (
    <div className="middle">
      <h1 className="title1">Flex Manager</h1>
      <div className="container">
        <h2 className="title2">Password Reset</h2>
        <TextField
          type="text"
          sx={{
            backgroundColor: "white",
            mb: 2
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="E-mail Address"
        />
        <Button
          className="gradient__btn reset__btn"
          onClick={() => sendPasswordReset(email)}
        >
          Send password reset email
        </Button>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
        <div>
          Wrong place? Go to <Link to="/">Login</Link>.
        </div>
      </div>
    </div>
  );
}
export default Reset;
