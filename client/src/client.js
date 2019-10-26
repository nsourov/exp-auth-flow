import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink
} from "apollo-boost";

const uri = process.env.REACT_APP_BACKEND_API;
const httpLink = new HttpLink({ uri });

const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  const token = localStorage.getItem("jwtToken");

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ""
    }
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;
