import React, { useState } from "react";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import Calendar from "../calendar-events-svgrepo-com.svg";
import Edit from "../edit-svgrepo-com.svg";
import Message from "../message-svgrepo-com.svg";
import Settings from "../settings-tools-and-utensils-svgrepo-com.svg";
import "./HomeScreen.css";

function HomeScreen() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="dashboard__welcome">Welcome to flex-manager</h1>
      <h2 className="dashboard__description">What are you here for today?</h2>
      <div className="dashboard__cards">
        <Button
          className="dashboard__card"
          onClick={() => navigate("/dashboard/view_schedule")}
        >
          <img
            src={Calendar}
            alt="calendar logo"
            className="HomeScreen__icon"
          />
          <h2>View Schedule</h2>
        </Button>
        <Button
          className="dashboard__card"
          onClick={() => navigate("/dashboard/edit_schedule")}
        >
          <img src={Edit} alt="edit logo" className="HomeScreen__icon" />
          <h2>Edit Schedule</h2>
        </Button>
        <Button
          className="dashboard__card"
          onClick={() => navigate("/dashboard/messages")}
        >
          <img src={Message} alt="message logo" className="HomeScreen__icon" />
          <h2>Messages</h2>
        </Button>
        <Button
          className="dashboard__card"
          onClick={() => navigate("/dashboard/account_settings")}
        >
          <img src={Settings} alt="settings logo" className="HomeScreen__icon" />
          <h2>Account Settings</h2>
        </Button>
      </div>
    </div>
  );
}

export default HomeScreen;
