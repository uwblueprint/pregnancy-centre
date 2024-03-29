import * as admin from "firebase-admin";
import { ApolloServer } from "apollo-server-express";
import { AuthenticationError } from "apollo-server-express";
import bodyParser from "body-parser";
import { connectDB } from "./database/mongoConnection";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { getUser } from "./auth/firebase";
import inflate from "inflation";
import raw from "raw-body";

import { resolvers } from "./api/resolvers";
import { typeDefs } from "./api/schema";

// TODO: need to make script to build(compile) prod server and to run prod server

// //-----------------------------------------------------------------------------
// // APOLLO SETUP
// //-----------------------------------------------------------------------------

dotenv.config();
const PORT = process.env.PORT;
const isProd = process.env.NODE_ENV !== "dev";
const corsPolicy = {
    origin: process.env.CLIENT_URL,
    credentials: true
};

// -----------------------------------------------------------------------------
// MONGODB CONNECTION AND DATA SOURCES FOR APOLLO
// -----------------------------------------------------------------------------

// connect to MongoDB
connectDB();

// -----------------------------------------------------------------------------
// SERVER LAUNCH
// -----------------------------------------------------------------------------

async function gqlServer() {
    const app = express();
    app.use(cookieParser());
    app.use("/sessionLogin", bodyParser.json({ strict: true, type: "application/json" }));
    app.use(cors(corsPolicy));

    //custom body parser for apolloClient GraphQL queries using CreateHTTPLink because express.json() is buggy
    app.use("/graphql", async (req, res, next) => {
        if (
            req &&
            req.headers &&
            req.headers["content-type"] &&
            (req.headers["content-type"] === "application/graphql" ||
                req.headers["content-type"].includes("application/graphql"))
        ) {
            const str = await raw(inflate(req), { encoding: "utf8" });
            req.body = JSON.parse(str);
        }
        await next();
    });

    app.post("/sessionLogin", (req, res) => {
        // Get the ID token passed
        const idToken = req.body.idToken.toString();
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
                        secure: true
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
        context: async ({ req, res }) => ({
            authenticateUser: async () => {
                if (!isProd) {
                    return { req, res, user: null };
                }

                if (!req.cookies || !req.cookies.session) {
                    throw new AuthenticationError("Authentication Not Found");
                }

                const user = await getUser(req.cookies.session);
                if (!user || !user.id) throw new AuthenticationError("Forbidden Error");

                return { req, res, user };
            }
        })
    });

    server.applyMiddleware({
        app,
        path: "/graphql",
        bodyParserConfig: { strict: true, type: "application/*" },
        cors: corsPolicy
    });

    app.listen({ port: PORT });
    console.log(`🚀 Server ready at port ${PORT}`);

    return { server, app };
}

gqlServer();
