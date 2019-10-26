import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import appReducer from "./reducers";

const initialState = {};

const rootReducer = (state, action) => {
  // NOTE: We need to reset the store on logout
  // ref: https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store
  if (action.type === "LOGOUT_USER") {
    state = undefined;
  }
  return appReducer(state, action);
};

const composeEnhancers = composeWithDevTools({
  // Specify custom devTools options
});
const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
