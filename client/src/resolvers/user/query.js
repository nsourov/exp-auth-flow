import gql from "graphql-tag";

import { USER_FRAGMENT } from "./fragment";

export const GET_USER = gql`
  query GET_USER {
    me {
      ...User
    }
  }
  ${USER_FRAGMENT}
`;
