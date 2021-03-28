import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { connectDB } from "./database/mongoConnection";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { getUser } from "./auth/firebase";
import raw from "raw-body";
import inflate from "inflation";
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
import { bodyParserGraphQL } from "body-parser-graphql";

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

async function gqlServer() {
  const app = express();
  app.use(cookieParser());
  app.use("/graphql", bodyParserGraphQL());
  app.use("/sessionLogin", bodyParser.json({ strict: false, type: "*/*" }));
  // app.use(
  //   express.urlencoded({
  //     extended: true,
  //   })
  // );
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(async (req, res, next) => {
    if (
      req.headers["content-type"] === "application/graphql" ||
      req.headers["content-type"].includes("application/graphql")
    ) {
      const str = await raw(inflate(req), { encoding: "utf8" });
      console.log(JSON.parse(str));
      req.body = JSON.parse(str);
    }
    await next();
  });
  // app.post("/graphql", (req) => {
  //   console.log(req.body);
  // });
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
  server.applyMiddleware({
    app,
    path: "/graphql",
    bodyParserConfig: { strict: false, type: "*/*" },
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  // app.use("/graphql", express.json());

  // await server.start();

  app.listen({ port: PORT });
  console.log(`🚀 Server ready at port ${PORT}`);
  return { server, app };
}

gqlServer();
