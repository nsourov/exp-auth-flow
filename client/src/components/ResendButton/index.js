import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";

import { SEND_VERIFICATION } from "../../resolvers/user/mutation";

const ResendButton = ({ email }) => {
  const [sent, setSent] = useState(false);
  const [sendVerification] = useMutation(SEND_VERIFICATION, {
    variables: { email }
  });

  const onClick = async () =>
    await Promise.all[setSent(true), sendVerification()];
  return (
    <Link to="#" onClick={onClick}>
      {sent ? "Sent" : "Resend"}
    </Link>
  );
};
export default ResendButton;
