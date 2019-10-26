import React, { Component, lazy, Suspense } from "react";
import {
  withRouter,
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import jwtDecode from "jwt-decode";
import { withApollo } from "react-apollo";
import { connect } from "react-redux";
import { Result, Button } from "antd";

import store from "../../store";
import { setCurrentUser, logoutUser } from "../../actions/authentication";
import { GET_USER } from "../../resolvers/user/query";

import client from "../../client";

import Fallback from "../../components/Fallback";
import Verify from "../Verify";

const Login = lazy(() => import("../Login"));
const Register = lazy(() => import("../Register"));
const Profile = lazy(() => import("../Profile"));
const PasswordReset = lazy(() => import('../PasswordReset'));

const ProtectedRoute = lazy(() => import("../../components/ProtectedRoute"));

class App extends Component {
  state = {
    loading: true
  };

  async componentDidMount() {
    await this.checkAuth();
    this.setLoading(false);
  }

  setLoading = bool => {
    this.setState({ loading: bool });
  };

  async checkAuth() {
    try {
      if (localStorage.jwtToken) {
        const decoded = jwtDecode(localStorage.jwtToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          return this.logout();
        }

        // verify token with server
        const response = await client.query({ query: GET_USER });
        if (response.data.me) {
          return this.login(response.data.me);
        }
        return this.removeUserData();
      }
    } catch (error) {
      this.removeUserData();
    }
  }

  async login(decoded) {
    store.dispatch(setCurrentUser(decoded));
  }

  async removeUserData() {
    store.dispatch(logoutUser());
  }

  async logout() {
    this.removeUserData();
    const { history } = this.props;
    history.push("/login");
  }

  render() {
    const {
      auth: { isAuthenticated }
    } = this.props;
    const { loading } = this.state;

    if (loading) return <Fallback />;

    return (
      <Suspense fallback={<Fallback />}>
        <Router>
          <Switch>
            <ProtectedRoute
              exact
              path="/"
              component={Profile}
              isAuthenticated={isAuthenticated}
            />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/reset" component={PasswordReset} />
            <Route path="/verify" component={Verify} />
            {/* Default 404 */}
            <Route
              render={() => (
                <Result
                  status="404"
                  title="404"
                  subTitle="Sorry, the page you visited does not exist."
                  extra={
                    <Button type="primary" href="/">
                      Back Home
                    </Button>
                  }
                />
              )}
            />
          </Switch>
        </Router>
      </Suspense>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withApollo(withRouter(App)));
