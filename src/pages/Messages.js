import React, { useState } from "react";
import PaperAirplane from "../paper-plane-svgrepo-com.svg";
import "./Messages.css";

function Messages() {
  return (
    <div>
      <h1 className="Messages__header">Messages</h1>
      <div className="Messages__container">
        <img src={PaperAirplane} alt="paper airplane" height="300px" />
        <p className="Messages__text">No new messages from your teacher.</p>
      </div>
    </div>
  );
}

export default Messages;
