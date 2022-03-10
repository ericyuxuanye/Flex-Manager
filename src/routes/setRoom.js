import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./setRoom.css";
import { TextField } from "@mui/material";
import { setDefaultClass, auth, db, DBState } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc, doc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import Button from "../Button";

function SetRoom() {
  const [number, setNumber] = useState(NaN);
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const confirmDB = useRecoilValue(DBState);
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
      await setDefaultClass(number);
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!confirmDB) return;
    if (!user) return navigate("/");
    fetchDefaultClass();
  });

  return (
    <div className="middle">
      <h1 className="title1">Flex Manager</h1>
      <div className="container">
        <h2 className="title2">Please set your default Class</h2>
        <div className="setClassUserInput">
          <TextField
            type="number"
            label="Default Class"
            placeholder="Default Class"
            onChange={(e) => setNumber(e.target.valueAsNumber)}
            className="textBox"
            inputProps={{
              onInput: (e) =>
                (e.target.value = e.target.value.replace(/(?![0-9])./gim, "")),
            }}
          />
          <Button onClick={submit} className="gradient__btn submit__btn">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SetRoom;
