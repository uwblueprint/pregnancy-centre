import { ApolloServer } from 'apollo-server'
import { connectDB } from './database/mongoConnection'
import dotenv from 'dotenv'

import { ClientCache, RequestCache, RequestGroupCache, RequestTypeCache } from './database/cache'
import ClientDataSource from './datasources/clientDataSource'
import RequestDataSource from './datasources/requestDataSource'
import RequestGroupDataSource from './datasources/requestGroupDataSource'
import RequestTypeDataSource from './datasources/requestTypeDataSource'
import { resolvers } from './graphql/resolvers'
import { typeDefs } from './graphql/schema'

// TODO: need to make script to build(compile) prod server and to run prod server

// //-----------------------------------------------------------------------------
// // APOLLO SETUP
// //-----------------------------------------------------------------------------

dotenv.config()
const PORT = process.env.PORT

// -----------------------------------------------------------------------------
// MONGODB CONNECTION AND DATA SOURCES FOR APOLLO
// -----------------------------------------------------------------------------

// connect to MongoDB and setup data sources
connectDB(() => {
  ClientCache.init()
  RequestCache.init()
  RequestTypeCache.init()
  RequestGroupCache.init()
})

// -----------------------------------------------------------------------------
// SERVER LAUNCH
// -----------------------------------------------------------------------------

const timeTracking = {
  // Fires whenever a GraphQL request is received from a client.
  requestDidStart(requestContext) {
    console.log('Request started!' +" @ " + (new Date()).toLocaleString("en-US"));

    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      parsingDidStart(requestContext) {
        console.log('Parsing started!' + " @ " + (new Date()).toLocaleString("en-US"));
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      validationDidStart(requestContext) {
        console.log('Validation started!' + " @ " + (new Date()).toLocaleString("en-US"));
      },

      executionDidStart(requestContext) {
        console.log('Executing query!' + " @ " + (new Date()).toLocaleString("en-US"));
      },

      willResolveField(requestContext) {
        console.log('Resolving field!' + " @ " + (new Date()).toLocaleString("en-US"));
      },

      willSendResponse(requestContext) {
        console.log('Sending response!' + " @ " + (new Date()).toLocaleString("en-US"));
      }
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    clients: new ClientDataSource(),
    requests: new RequestDataSource(),
    requestTypes: new RequestTypeDataSource(),
    requestGroups: new RequestGroupDataSource(),
  }),
  plugins: [
    timeTracking
  ]
})

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
