import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./setRoom.css";
import { setDefaultClass, auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc, doc } from "firebase/firestore";

function SetRoom() {
  const [number, setNumber] = useState(NaN);
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  /* if user already has default class, navigate away */
  const fetchDefaultClass = async () => {
    try {
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (!docSnap.exists()) {
        throw new Error("Cannot find document associated with user");
      }
      const data = docSnap.data();
      if (data.defaultClass !== undefined) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching user data");
    }
  };

  const submit = async () => {
    if (!Number.isNaN(number)) {
      console.log(number);
      await setDefaultClass(number);
      navigate("/Dashboard");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchDefaultClass();
  });

  return (
    <div className="middle">
      <h1 className="title1">Flex Manager</h1>
      <div className="container">
        <h2 className="title2">Please set your default Class</h2>
        <div className="setClassUserInput">
          <input
            type="number"
            label="Default Class Number"
            placeholder="Default Class Number"
            onChange={(e) => setNumber(e.target.valueAsNumber)}
            className="default_class--textBox"
          />
          <button onClick={submit} className="btn gradient__btn submit__btn">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetRoom;
