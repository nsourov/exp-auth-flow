import React, { Suspense, lazy } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Typography, Card, Form, Input, Button, message, Spin } from "antd";

import { useMutation } from "@apollo/react-hooks";
import { useForm } from "sunflower-antd";

import { logoutUser } from "../../actions/authentication";
import { formatError } from "../../common/error-message";
import { UPDATE_USER } from "../../resolvers/user/mutation";

import "./style.css";

import Fallback from "../../components/Fallback";

const { Title } = Typography;
const { Item, create } = Form;

const layout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 4
    },
    sm: {
      span: 16,
      offset: 4
    }
  }
};

const fields = [
  {
    label: "E-mail",
    labelFor: "email",
    inputType: "email",
    rules: {
      validate: [
        {
          trigger: "onBlur",
          rules: [
            {
              type: "email",
              message: "The input is not valid E-mail!"
            }
          ]
        }
      ]
    }
  }
];

const AccountSettings = props => {
  const [update] = useMutation(UPDATE_USER);
  const { form, auth } = props;

  const { formProps, formLoading } = useForm({
    form,
    async submit({ email }) {
      try {
        await update({
          variables: { email }
        });
        message.success("Please verify the email to update", 1);
      } catch (error) {
        message.destroy();
        message.error(formatError(error));
      }
    },
    defaultFormValues() {
      const { name, email } = auth.user;
      return {
        name,
        email
      };
    }
  });

  const onLogout = () => {
    props.logoutUser();
    message.warning("You are now logged out!");
  };

  return (
    <div className="layout-wrapper">
      <Suspense fallback={<Fallback hasParent />}>
        <br />
        <Card
          size="small"
          title={<Title level={4}>Update Account</Title>}
          style={{ width: 500, marginTop: 50 }}
        >
          <Spin spinning={formLoading} size="large" tip="Updating User Info">
            <Form {...layout} {...formProps} labelAlign="left">
              {fields.map(field => (
                <Item label={field.label} key={field.label} hasFeedback>
                  {form.getFieldDecorator(field.labelFor, field.rules)(
                    <Input type={field.inputType} />
                  )}
                </Item>
              ))}
              <Item {...tailFormItemLayout}>
                <div className="profile-action">
                  <Button type="primary" htmlType="submit" icon="edit">
                    Update
                  </Button>
                  <Button
                    type="danger"
                    htmlType="submit"
                    onClick={onLogout}
                    icon="logout"
                  >
                    Logout
                  </Button>
                </div>
              </Item>
            </Form>
          </Spin>
        </Card>
      </Suspense>
    </div>
  );
};

const FormComponent = create({ name: "account-settings" })(AccountSettings);

FormComponent.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool.isRequired,
    user: PropTypes.object
  })
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(FormComponent);
