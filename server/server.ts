require('dotenv').config();
const mongoose = require('mongoose');
const { ApolloServer, gql } = require('apollo-server');
import { connectDB } from "./mongoConnection";
import { ResultsCache } from "./cache";

// TODO: need to make script to build(compile) prod server and to run prod server


// //-----------------------------------------------------------------------------
// // APOLLO SETUP
// //-----------------------------------------------------------------------------

const typeDefs = require('./schema.ts')

//-----------------------------------------------------------------------------
// SERVER LAUNCH
//-----------------------------------------------------------------------------

const server = new ApolloServer({ typeDefs });
const port = 4000;
server.listen({ port }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});

//-----------------------------------------------------------------------------
// MONGODB CONNECTION AND CACHING
//-----------------------------------------------------------------------------

// connect to MongoDB and initialize caches
connectDB(() => {
    ResultsCache.init();
});

