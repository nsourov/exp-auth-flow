import gql from 'graphql-tag';

export const USER_FRAGMENT = gql`
  fragment User on User {
    id
    name
    email
  }
`;
