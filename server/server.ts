import { ApolloServer } from 'apollo-server'
import { connectDB } from './database/mongoConnection'
import dotenv from 'dotenv'

import RequestDataSource from './datasources/requestsDataSource'
import { RequestsCache } from './database/cache'
import { resolvers } from './graphql/resolvers'
import { typeDefs } from './graphql/schema'

// TODO: need to make script to build(compile) prod server and to run prod server

// //-----------------------------------------------------------------------------
// // APOLLO SETUP
// //-----------------------------------------------------------------------------

dotenv.config()
const CACHING = process.env.CACHING == 'TRUE'
const PORT = process.env.PORT

// -----------------------------------------------------------------------------
// MONGODB CONNECTION AND DATA SOURCES FOR APOLLO
// -----------------------------------------------------------------------------

// connect to MongoDB and setup data sources
connectDB(() => {
  if (CACHING) {
    RequestsCache.init()
  }
})

// -----------------------------------------------------------------------------
// SERVER LAUNCH
// -----------------------------------------------------------------------------

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    requests: new RequestDataSource()
  })
})

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
