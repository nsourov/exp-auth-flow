import gql from "graphql-tag";

import { USER_FRAGMENT } from "./fragment";

export const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $password: String!
    $name: String!
  ) {
    signup(email: $email, password: $password, name: $name) {
      message
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const SEND_VERIFICATION = gql`
  mutation SEND_VERIFICATION($email: String!) {
    sendVerification(email: $email) {
      message
    }
  }
`;

export const VERIFY_EMAIL = gql`
  mutation VERIFY_EMAIL($email: String, $emailToken: String!) {
    verifyEmail(emailToken: $emailToken, email: $email) {
      message
    }
  }
`;
