import React, {useState} from "react";

import "./Banner.css";

function Banner(){
	return(
		<div className="Banner__banner">
			<div className="Banner__logo">Logo</div>
			<div className="Banner__spacer"></div>
			<div className="Banner__navigation">Link1</div>
			<div className="Banner__navigation">Link2</div>
			<div className="Banner__navigation">Link3</div>
			<div className="Banner__navigation">Link4</div>
			<div className="Banner__navigation">Link5</div>
			<div className="Banner__navigation">Link6</div>
		</div>
		)
}

export default Banner
