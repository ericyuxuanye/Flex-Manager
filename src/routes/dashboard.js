import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import { auth, db, logout } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [defaultClass, setDefaultClass] = useState(NaN);
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (!docSnap.exists()) {
        throw new Error("Cannot find document associated with user"); 
      }
      const data = docSnap.data();
      setName(data.name);
      setDefaultClass(data.defaultClass);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    if (defaultClass === undefined) return navigate("/setRoom");
    // fetch user name after we are sure the user exists
    fetchUserName();
  });
  return (
    <div className="middle">
      <h1 className="title1">Dashboard</h1>
      <div className="container">
        Logged in as
        <div>{name}</div>
        <div>{user?.email}</div>
        <p>Default class: {defaultClass}</p>
        <button className="btn gradient__btn dashboard__btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
export default Dashboard;
