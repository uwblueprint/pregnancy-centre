require('dotenv').config();
import mongoose from 'mongoose';
import { ApolloServer, gql } from 'apollo-server';
import { connectDB } from "./mongoConnection";

import { Request, RequestDocument } from './models/requestModel';
import RequestDataSource from './datasources/requestsDataSource'
import { RequestsCache } from "./cache";

// TODO: need to make script to build(compile) prod server and to run prod server


// //-----------------------------------------------------------------------------
// // APOLLO SETUP
// //-----------------------------------------------------------------------------

import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

//-----------------------------------------------------------------------------
// MONGODB CONNECTION AND DATA SOURCES FOR APOLLO
//-----------------------------------------------------------------------------

// connect to MongoDB and setup data sources
connectDB(() => {
    RequestsCache.init();
});


//-----------------------------------------------------------------------------
// SERVER LAUNCH
//-----------------------------------------------------------------------------

const server = new ApolloServer({ typeDefs, resolvers, dataSources: () => ({
    requests: new RequestDataSource()
}) });

const port = 4000;
server.listen({ port }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});

