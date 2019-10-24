import { GraphQLServer } from 'graphql-yoga';
import resolvers from '../resolvers';
import { prisma } from '../generated/prisma-client';

function createServer() {
  return new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers,
    context: request => {
      return {
        ...request,
        prisma,
      };
    },
  });
}

export default createServer;
