import React, { useState } from "react";

import PropTypes from "prop-types";
import { Link, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { useMutation } from "@apollo/react-hooks";
import { useForm } from "sunflower-antd";
import { Button, Form, Icon, Input, Spin, message } from "antd";

import { formatError } from "../../common/error-message";
import formRules from "../../common/form-rules";
import { SIGNUP_MUTATION } from "../../resolvers/user/mutation";

import ResendButton from "../../components/ResendButton";

import "./style.css";

const { Item, create } = Form;

const RegisterForm = props => {
  const [signup] = useMutation(SIGNUP_MUTATION);
  const [authMessage, setMessage] = useState(null);

  const { form, location, auth } = props;
  const { formProps, formLoading } = useForm({
    form,
    async submit(variables) {
      try {
        const { data } = await signup({ variables });
        setMessage(data.signup.message);
      } catch (error) {
        message.error(formatError(error));
      }
    }
  });

  if (auth.isAuthenticated) {
    const { from } = location.state || { from: { pathname: "/" } };
    return <Redirect to={from} />;
  }

  return (
    <div className="layout-wrapper">
      {authMessage && (
        <p>
          {authMessage}. <ResendButton email={form.getFieldValue("email")} />
        </p>
      )}
      <Spin spinning={formLoading} size="large" tip="Creating account">
        <Form {...formProps} className="register-form">
          <Item>
            {form.getFieldDecorator("name", formRules.name)(
              <Input prefix={<Icon type="user" />} placeholder="Name" />
            )}
          </Item>
          <Item>
            {form.getFieldDecorator("email", formRules.email)(
              <Input prefix={<Icon type="mail" />} placeholder="Email" />
            )}
          </Item>
          <Item>
            {form.getFieldDecorator("password", formRules.password)(
              <Input
                prefix={<Icon type="lock" />}
                type="password"
                placeholder="Password"
              />
            )}
          </Item>
          <Item>
            <Button
              type="primary"
              htmlType="submit"
              className="register-form-button"
            >
              Create an account
            </Button>
            Or <Link to="/login">Already have an account?</Link>
          </Item>
        </Form>
      </Spin>
    </div>
  );
};

RegisterForm.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool.isRequired,
    user: PropTypes.object
  })
};

const mapStateToProps = state => ({
  auth: state.auth
});
const WrappedRegisterForm = create({ name: "register" })(RegisterForm);

export default connect(mapStateToProps)(withRouter(WrappedRegisterForm));
