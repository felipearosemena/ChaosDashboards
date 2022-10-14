import { createServer } from "@graphql-yoga/node";
import { typeDefs } from "lib/graphql/schema";
import resolvers from "lib/graphql/resolvers";
import { DIRECTIVES } from "@graphql-codegen/typescript-mongodb";

const server = createServer({
  schema: {
    typeDefs: [DIRECTIVES, typeDefs],
    resolvers,
  },
  endpoint: "/api/graphql",
});

export default server;
