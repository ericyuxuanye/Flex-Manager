import React, { Component } from "react";
import "./Button.css";
// An implementation of a ripple button
class Button extends Component {
  constructor(props) {
    super(props);
    this.createRipple = this.createRipple.bind(this);
    this.innerDiv = React.createRef();
  }
  createRipple(event) {
    console.log(event);

    const target = this.innerDiv.current;
    const button = event.currentTarget;

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    target.appendChild(circle);

    /*
    setTimeout(() => {
      circle.remove();
    }, 3000);
    */
  }
  render() {
    return (
      <button
        onMouseDown={this.createRipple}
        onClick={this.props.onClick}
        className={`btn ${this.props.className}`}
      >
        <div className="innerDiv" ref={this.innerDiv} />
        {this.props.children}
      </button>
    );
  }
}

export default Button;
