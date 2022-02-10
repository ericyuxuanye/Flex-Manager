import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./login.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const linkStyle = {
    "textDecoration": "none",
  };
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);
  return (
    <div className="login">
      {/*replace with logo*/}
      <h1 className="title1">Flex Scheduler</h1>
      <div className="login__container">
        <h2 className="title2">Log In</h2>
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <div className="login__remember">
          <input
            type="checkbox"
            id="login__checkBox1"
            name="login__checkBox1"
            className="login__checkBox"
            onChange={(e) =>
              setRemember(e.target.value === "unchecked" ? false : true)
            }
          />
          <label htmlFor="login__checkBox1">Remember me</label>
          <br />
        </div>
        <button
          className="login__btn"
          onClick={() => logInWithEmailAndPassword(email, password, remember)}
        >
          Login
        </button>
        <button className="login__btn login__google" onClick={signInWithGoogle}>
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
