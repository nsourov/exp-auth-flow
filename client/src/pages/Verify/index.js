import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { Redirect, withRouter } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Spin, message } from "antd";

import { VERIFY_EMAIL } from "../../resolvers/user/mutation";
import { formatError } from "../../common/error-message";

const Verify = props => {
  const [redirect, SetRedirect] = useState(false);
  const { location, history } = props;
  const { token } = queryString.parse(location.search);
  const [verifyEmail, { loading }] = useMutation(VERIFY_EMAIL, {
    variables: { emailToken: token }
  });

  useEffect(() => {
    const onVerify = async () => {
      try {
        await verifyEmail();
        // TODO: Login the user here
        SetRedirect(true);
      } catch (error) {
        message.error(formatError(error));
        history.push("/login");
      }
    };
    onVerify();
  }, []);
  if (redirect)
    return <Redirect to={{ pathname: "/login", message: "You are verified" }} />;
  return <Spin spinning={loading} />;
};

export default withRouter(Verify);
