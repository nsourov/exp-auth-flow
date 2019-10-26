import {
  SET_CURRENT_USER,
  LOGOUT_USER
} from "../actions/types";
import isEmpty from "../common/is-empty";

const initialState = {
  isAuthenticated: false,
  user: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case LOGOUT_USER:
      // Set empty value on logout
      return initialState;
    default:
      return state;
  }
}
