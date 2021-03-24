import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { connectDB } from "./database/mongoConnection";
import dotenv from "dotenv";
import express from "express";
import * as admin from "firebase-admin";

import {
  ClientCache,
  RequestCache,
  RequestGroupCache,
  RequestTypeCache,
} from "./database/cache";
import ClientDataSource from "./datasources/clientDataSource";
import RequestDataSource from "./datasources/requestDataSource";
import RequestGroupDataSource from "./datasources/requestGroupDataSource";
import RequestTypeDataSource from "./datasources/requestTypeDataSource";
import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/schema";

// TODO: need to make script to build(compile) prod server and to run prod server

// //-----------------------------------------------------------------------------
// // APOLLO SETUP
// //-----------------------------------------------------------------------------

dotenv.config();
const PORT = process.env.PORT;

// -----------------------------------------------------------------------------
// MONGODB CONNECTION AND DATA SOURCES FOR APOLLO
// -----------------------------------------------------------------------------

// connect to MongoDB and setup data sources
connectDB(() => {
  ClientCache.init();
  RequestCache.init();
  RequestTypeCache.init();
  RequestGroupCache.init();
});

// -----------------------------------------------------------------------------
// SERVER LAUNCH
// -----------------------------------------------------------------------------

const verify = async (idToken) => {
  if (idToken) {
    console.log(idToken);
    var newToken = idToken.replace("Bearer ", "");
    let header = await admin
      .auth()
      .verifyIdToken(newToken)
      .then(function (decodedToken) {
        return {
          Authorization: "Bearer " + decodedToken,
        };
      })
      .catch(function (error) {
        console.log(error);
        return null;
      });
    return header;
  } else {
    throw { message: "No Token" };
  }
};

function gqlServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => {
      console.log(req.headers);
      const verified = await verify(req.headers.Authorization);
      if (!verified) throw new AuthenticationError("Authentication Error");
      console.log("log verified", verified);
      return {
        headers: verified ? verified : "",
        req,
        res,
      };
    },
    dataSources: () => ({
      clients: new ClientDataSource(),
      requests: new RequestDataSource(),
      requestTypes: new RequestTypeDataSource(),
      requestGroups: new RequestGroupDataSource(),
    }),
  });

  server.applyMiddleware({ app, path: "/", cors: true });

  return app;
}

gqlServer().listen({ port: PORT });
console.log(`🚀 Server ready at port ${PORT}`);
