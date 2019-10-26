import React from 'react';
import queryString from 'query-string';
import { withRouter, Redirect } from 'react-router-dom';
import { useForm } from 'sunflower-antd';
import { useMutation } from '@apollo/react-hooks';
import { Button, Form, Icon, Input, Spin, message } from 'antd';

import formRules from '../../common/form-rules';
import { formatError } from '../../common/error-message';
import { REQUEST_RESET, RESET_PASSWORD } from '../../resolvers/user/mutation';

import './style.css';

const { Item, create } = Form;

const ResetPasswordForm = props => {
  const { form, location } = props;

  const { resetToken } = queryString.parse(location.search);

  const [requestReset] = useMutation(REQUEST_RESET);
  const [resetPassword] = useMutation(RESET_PASSWORD);

  const { formProps, formResult, formLoading } = useForm({
    form,
    async submit({ email, password, confirmPassword }) {
      try {
        if (resetToken) {
          const {
            data: {
              resetPassword: { message: resetMessage },
            },
          } = await resetPassword({
            variables: { resetToken, password, confirmPassword },
          });

          message.success(resetMessage);
        } else {
          const {
            data: {
              requestReset: { message: requestMessage },
            },
          } = await requestReset({ variables: { email } });

          message.success(requestMessage);
        }

        return true;
      } catch (error) {
        message.destroy();
        message.error(formatError(error));

        return false;
      }
    },
  });

  // Redirect to login only after changing password
  if (formResult && resetToken) {
    return <Redirect to="/login" />;
  }

  // Add confirm password rule
  const rules = {
    ...formRules,
    confirmPassword: {
      validate: [
        {
          trigger: 'onBlur',
          rules: [
            {
              required: true,
              message: 'Please confirm password',
            },
            {
              min: 6,
              message: 'Password must be minimum 6 characters',
            },
            // Check for the password and confirm password is same
            {
              validator: (rule, value, callback) => {
                if (value && value !== form.getFieldValue('password')) {
                  callback('Two passwords that you enter is inconsistent!');
                } else {
                  callback();
                }
              },
            },
          ],
        },
      ],
    },
  };

  return (
    <>
      <div className="layout-wrapper">
        <Spin spinning={formLoading} size="large" tip="Loading">
          {resetToken ? (
            <Form {...formProps} className="reset-form">
              <Item>
                {form.getFieldDecorator('password', rules.password)(
                  <Input.Password
                    prefix={<Icon type="lock" />}
                    placeholder="Password"
                  />
                )}
              </Item>
              <Item>
                {form.getFieldDecorator(
                  'confirmPassword',
                  rules.confirmPassword
                )(
                  <Input.Password
                    prefix={<Icon type="lock" />}
                    placeholder="Confirm Password"
                  />
                )}
              </Item>

              <Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="reset-form-button"
                >
                  Reset password
                </Button>
              </Item>
            </Form>
          ) : (
            <Form {...formProps} className="reset-form">
              <Item>
                {form.getFieldDecorator('email', formRules.email)(
                  <Input prefix={<Icon type="user" />} placeholder="Email" />
                )}
              </Item>

              <Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="reset-form-button"
                >
                  Reset password
                </Button>
              </Item>
            </Form>
          )}
        </Spin>
      </div>
    </>
  );
};

const WrappedResetPasswordForm = create({ name: 'reset' })(ResetPasswordForm);
export default withRouter(WrappedResetPasswordForm);
