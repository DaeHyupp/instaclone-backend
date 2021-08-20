require("dotenv").config();
import http from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { typeDefs, resolvers } from "./schema";
import { getUser, protectResolver } from "./users/users.utils";
import { graphqlUploadExpress } from "graphql-upload";
import { makeExecutableSchema } from "@graphql-tools/schema";
//import logger from "morgan";
import pubsub from "./pubsub";

const PORT = process.env.PORT;
const app = express();

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async (ctx) => {
      if (ctx.req) {
        return {
          loggedInUser: await getUser(ctx.req.headers.token),
        };
      }
    },
  });
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  await server.start();

  app.use(graphqlUploadExpress());
  //app.use(logger("tiny"));
  server.applyMiddleware({ app });
  app.use("/static", express.static("uploads"));
  const httpServer = http.createServer(app);
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      async onConnect({ token }) {
        console.log(token);
        if (!token) {
          throw new Error("You cant listen");
        }
        return {
          loggedInUser: await getUser(token),
        };
        throw new Error("No token");
      },
    },
    { server: httpServer, path: server.graphqlPath }
  );
  await new Promise((r) => httpServer.listen({ port: PORT }, r)).then(() =>
    console.log(
      `🚀 Server is running on http://localhost:${PORT}${server.graphqlPath} ✅`
    )
  );
};
startServer();
