import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { useMutation } from "@apollo/react-hooks";
import { useForm } from "sunflower-antd";
import { Button, Form, Icon, Input, Spin, message } from "antd";

import { loginUser } from "../../actions/authentication";
import { formatError } from "../../common/error-message";
import formRules from "../../common/form-rules";
import { LOGIN_MUTATION } from "../../resolvers/user/mutation";

import ResendButton from "../../components/ResendButton";

import "./style.css";

const { Item, create } = Form;

const LoginForm = props => {
  const [submitted, setSubmitted] = useState(true);
  const [authError, setError] = useState(null);

  const [login] = useMutation(LOGIN_MUTATION);
  const { form, location, auth } = props;

  const { formProps, formResult, formLoading } = useForm({
    form,
    async submit({ email, password }) {
      try {
        setSubmitted(false);
        const {
          data: {
            login: { token }
          }
        } = await login({ variables: { email, password } });
        message.success("Successfully logged in!");
        props.loginUser(token);
        return true;
      } catch (error) {
        const errorMessage = formatError(error);
        if (errorMessage === "You have to verify your email first") {
          setError(formatError(error));
        } else {
          message.error(errorMessage, 1);
        }
        return false;
      }
    }
  });

  useEffect(() => {
    if (formResult && !formLoading) {
      setSubmitted(true);
    }
  }, [formResult, formLoading]);

  useEffect(() => {
    if (location.message) {
      message.success(location.message, 1);
    }
  }, [location.message]);

  if (submitted && auth.isAuthenticated) {
    const { from } = location.state || { from: { pathname: "/" } };
    return <Redirect to={from} />;
  }
  return (
    <div className="layout-wrapper">
      {authError && (
        <p>
          {authError}. <ResendButton email={form.getFieldValue("email")} />
        </p>
      )}
      <Spin spinning={formLoading} size="large" tip="Authenticating">
        <Form {...formProps} className="login-form">
          <Item>
            {form.getFieldDecorator("email", formRules.email)(
              <Input prefix={<Icon type="user" />} placeholder="Email" />
            )}
          </Item>
          <Item>
            {form.getFieldDecorator("password", formRules.password)(
              <Input.Password
                prefix={<Icon type="lock" />}
                placeholder="Password"
              />
            )}
          </Item>
          <Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            Or <Link to="/register">Register now!</Link>
            <Link className="login-form-forgot" to="/reset">
              Forgot your password?
            </Link>
          </Item>
        </Form>
      </Spin>
    </div>
  );
};

LoginForm.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool.isRequired,
    user: PropTypes.object
  })
};

const mapStateToProps = state => ({
  auth: state.auth
});
const WrappedLoginForm = create({ name: "login" })(LoginForm);
export default connect(
  mapStateToProps,
  { loginUser }
)(withRouter(WrappedLoginForm));
