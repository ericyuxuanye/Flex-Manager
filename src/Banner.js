import React, { useState } from "react";
import { Avatar } from "@mui/material";
import "./Banner.css";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

function Banner(props) {
  return (
    <div className="Banner__banner">
      <div className="Banner__logo">Logo</div>
      <div className="Banner__spacer"></div>
      <div className="Banner__navigation">Link1</div>
      <div className="Banner__navigation">Link2</div>
      <div className="Banner__navigation">Link3</div>
      <div className="Banner__navigation">Link4</div>
      <div className="Banner__navigation">Link5</div>
      <div className="Banner__navigation">Link6</div>
      <Avatar className="avatar" {...stringAvatar(props.name)} />
    </div>
  );
}

export default Banner;
