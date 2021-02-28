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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    clients: new ClientDataSource(),
    requests: new RequestDataSource(),
    requestTypes: new RequestTypeDataSource(),
    requestGroups: new RequestGroupDataSource(),
  })
})

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
