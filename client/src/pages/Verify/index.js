import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import queryString from "query-string";
import { Redirect, withRouter } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Spin, message } from "antd";

import { VERIFY_EMAIL } from "../../resolvers/user/mutation";
import { formatError } from "../../common/error-message";
import { loginUser } from "../../actions/authentication";

const Verify = props => {
  const [redirect, SetRedirect] = useState(false);
  const { location, history } = props;
  const { token, email } = queryString.parse(location.search);
  const variables = {
    emailToken: token
  };
  if (email) variables.email = email;
  const [verifyEmail, { loading }] = useMutation(VERIFY_EMAIL, { variables });

  useEffect(() => {
    const onVerify = async () => {
      try {
        const {
          data: {
            verifyEmail: { token }
          }
        } = await verifyEmail();
        props.loginUser(token);
        SetRedirect(true);
      } catch (error) {
        console.log(error);
        message.error(formatError(error));
        history.push("/login");
      }
    };
    onVerify();
  }, []);
  if (redirect)
    return (
      <Redirect to={{ pathname: "/login", message: "You are verified" }} />
    );
  return <Spin spinning={loading} />;
};

Verify.propTypes = {
  loginUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { loginUser }
)(withRouter(Verify));
