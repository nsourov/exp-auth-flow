export const formatError = error => {
  // Graphql error is starts with  "GraphQL error: actual error".
  // Network error is starts with  "Network error: actual error".
  // So We need to delete that part and take the actual message
  return error.message.split(': ')[1];
};
