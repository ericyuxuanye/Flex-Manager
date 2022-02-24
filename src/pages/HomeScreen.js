import React, { useState } from "react";
import { logout } from "../firebase";
import Button from "../Button";
import "./HomeScreen.css";

function HomeScreen(props) {
  return (
    <div>
      <h1 className="dashboard__welcome">Welcome to flex-manager</h1>
      <h2 className="dashboard__description">What are you here for today?</h2>
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

export default HomeScreen;
