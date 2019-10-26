import React from "react";
import { Link } from "react-router-dom";

const ResendButton = ({ email }) => {
  const onClick = () => console.log({ email });
  return <Link to="#" onClick={onClick}>Resend</Link>;
};
export default ResendButton;
