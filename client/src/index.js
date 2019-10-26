import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { ApolloProvider } from 'react-apollo';

import Fallback from "./components/Fallback";
import App from "./pages/App";

import store from "./store";
import client from "./client";

import './App.css';
import 'antd/dist/antd.css';

function Container() {
  return (
    <Suspense fallback={<Fallback />}>
      <ApolloProvider client={client}>
        <Router>
          <Provider store={store}>
            <App />
          </Provider>
        </Router>
      </ApolloProvider>
    </Suspense>
  );
}

ReactDOM.render(<Container />, document.querySelector("#root"));
