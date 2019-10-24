const { GraphQLServer } = require("graphql-yoga");

const { API_PORT } = process.env;
const resolvers = require("./resolvers");

function createServer() {
  return new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers,
    context: request => {
      return {
        ...request
      };
    }
  });
}

const server = createServer();

// See better error
process.on("unhandledRejection", (err, p) => {
  log("An unhandledRejection occurred");
  log(`Rejected Promise: ${p}`);
  log(`Rejection: ${err}`);
});

const options = {
  port: API_PORT
};
server.start(options, () =>
  console.log(`Server is running on http://localhost:${API_PORT}`)
);
