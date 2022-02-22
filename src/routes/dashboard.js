import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import { auth, db, logout, DBState } from "../firebase";
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
  return (
    <div className="middle">
      <h1 className="title1">
        {fetchingUserName ? "Please Wait" : "Dashboard"}
      </h1>
      {fetchingUserName ? (
        <CircularProgress />
      ) : (
        <div className="container">
          Logged in as
          <div>{name}</div>
          <div>{user?.email}</div>
          <p>Default class: {defaultClass}</p>
          <Button className="gradient__btn dashboard__btn" onClick={logout}>
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}
export default Dashboard;
