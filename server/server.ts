import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { connectDB } from "./database/mongoConnection";
import { bodyParserGraphQL } from "body-parser-graphql";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { getUser } from "./auth/firebase";
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

function gqlServer() {
  const app = express();
  app.use(cookieParser());
  app.use(bodyParserGraphQL());
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => {
      console.log("COOKIECOOKIE", req.cookies);
      const user =
        req.cookies !== {} ? await getUser(req.cookies.session) : null;
      if (!user) throw new AuthenticationError("Authentication Error");
      console.log("log verified", user);
      console.log(req.body);
      return { req, res, user };
    },
    dataSources: () => ({
      clients: new ClientDataSource(),
      requests: new RequestDataSource(),
      requestTypes: new RequestTypeDataSource(),
      requestGroups: new RequestGroupDataSource(),
    }),
  });

  app.post("/sessionLogin", (req, res) => {
    console.log(req.body);
    // Get the ID token passed
    const idToken = req.body.idToken.toString();
    console.log(idToken);
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    // Create the session cookie. This will also verify the ID token in the process.
    // The session cookie will have the same claims as the ID token.
    // To only allow session cookie setting on recent sign-in, auth_time in ID token
    // can be checked to ensure user was recently signed in before creating a session cookie.
    admin
      .auth()
      .createSessionCookie(idToken, { expiresIn })
      .then(
        (sessionCookie) => {
          // Set cookie policy for session cookie.
          const options = {
            maxAge: expiresIn,
            httpOnly: true,
            secure: true,
          };
          res.cookie("session", sessionCookie, options);
          res.end(JSON.stringify({ status: "success" }));
        },
        (error) => {
          res.status(401).send(error);
        }
      );
  });

  server.applyMiddleware({
    app,
    path: "/",
    // bodyParserConfig: false,
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  return app;
}

gqlServer().listen({ port: PORT });
console.log(`🚀 Server ready at port ${PORT}`);
