import { ApolloLink, split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { getMainDefinition } from "apollo-utilities";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";

const uri =  process.env.REACT_APP_BACKEND_API;

const getToken = () => {
  const token = localStorage.getItem("jwtToken");
  const headers = {
    Authorization: token ? `Bearer ${token}` : ""
  };
  return headers;
};

// Create an http link:

const AuthLink = (operation, forward) => {
  operation.setContext(context => ({
    ...context,
    headers: {
      ...context.headers,
      authorization: getToken().Authorization
    }
  }));

  return forward(operation);
};

const httpLink = ApolloLink.from([
  AuthLink,
  new HttpLink({
    uri
  })
]);

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  httpLink
);

export default new ApolloClient({
  link,
  cache: new InMemoryCache()
});
