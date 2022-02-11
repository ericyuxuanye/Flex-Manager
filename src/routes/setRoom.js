import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./setRoom.css";
import { setDefaultClass } from "../firebase";

function SetRoom() {
  const [number, setNumber] = useState(NaN);
  const navigate = useNavigate();

  const submit = async () => {
    if (!Number.isNaN(number)) {
      console.log(number);
      await setDefaultClass(number);
      navigate("/Dashboard");
    }
  };

  return (
    <div className="setClassBox">
      <h1>Please set your default Class</h1>
      <div className="setClassUserInput">
        <input
          type="number"
          placeholder="Default Class Number"
          onChange={(e) => setNumber(e.target.valueAsNumber)}
        />
        <button onClick={submit}>Submit</button>
      </div>
    </div>
  );
}

export default SetRoom;
