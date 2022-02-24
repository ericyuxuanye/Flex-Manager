import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import { auth, db, logout, DBState } from "../firebase";
import Banner from "../Banner";
import { getDoc, doc } from "firebase/firestore";
import Button from "../Button";
import { CircularProgress } from "@mui/material";
import { useRecoilValue } from "recoil";
function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [defaultClass, setDefaultClass] = useState(NaN);
  const confirmDB = useRecoilValue(DBState);
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
      if (defaultClass === undefined) navigate("/setRoom");
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  const [fetchingUserName, setFetchingUserName] = useState(true);
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    // if we don't know the database is prepared yet, keep waiting
    if (!confirmDB) return;
    // fetch user name after we are sure the user exists
    fetchUserName().then(() => setFetchingUserName(false));
  });
  return fetchingUserName ? (
    <div className="middle">
      <CircularProgress />
    </div>
  ) : (
    <div>
      <Banner name={name}/>
      <h1 className="dashboard__welcome">
        Welcome to flex-manager
      </h1>
      <h2 className="dashboard__description">What are you here for today?</h2>
      <div className="dashboard__userinfo">
        <p>Hello, {name}</p>
        <p>Default class: {defaultClass}</p>
      </div>
      <div className="dashboard__cards">
        <Button className="dashboard__card"></Button>
        <Button className="dashboard__card"></Button>
        <Button className="dashboard__card"></Button>
        <Button className="dashboard__card"></Button>
        <Button className="dashboard__card"></Button>
        <Button className="dashboard__card"></Button>
      </div>
      <Button className="gradient__btn logout__btn" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
export default Dashboard;
