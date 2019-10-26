import jwtDecode from 'jwt-decode';

import {
  SET_CURRENT_USER,
  LOGOUT_USER,
} from './types';

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

export const getCurrentUser = () => dispatch => {
  const token = localStorage.getItem('jwtToken');
  const decoded = jwtDecode(token);
  dispatch(setCurrentUser(decoded));
};

export const loginUser = token => dispatch => {
  localStorage.setItem('jwtToken', token);
  const decoded = jwtDecode(token);
  dispatch(setCurrentUser(decoded));
};

export const logoutUser = () => dispatch => {
  localStorage.removeItem('jwtToken');
  dispatch(setCurrentUser({}));
  // This is just to reset the store on logout
  // ref: https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store
  dispatch({ type: LOGOUT_USER });
};
