import { gql } from 'apollo-server'

// TODO: date types

const typeDefs = gql`
    type Client {
        _id: ID
        clientId: String
        firstName: String
        lastName: String
    }
    type Request {
        _id: ID
        requestId: String
        clientId: ID
        dateUpdated: String
        dateCreated: String
        dateFulfilled: String
        deleted: Boolean
        fulfilled: Boolean
    }
    type RequestListing {
        open: [Request]
        fulfilled: [Request]
        deleted: [Request]
    }
    type RequestType {
        _id: ID
        name: String
        dateUpdated: String
        deleted: Boolean
        requests: RequestListing
        numOpen: Int
    }
    type RequestGroup {
        _id: ID
        name: String
        dateUpdated: String
        description: String
        deleted: Boolean
        requirements: String
        image: String
        requestTypes: [RequestType]
        numOpen: Int
    }
    type Query {
        client(id: ID): Client
        clients(id: ID): [Client]
        request(id: ID): Request
        requests: [Request]
        requestType(id: ID): RequestType
        requestTypes: [RequestType]
        requestGroup(id: ID): RequestGroup
        requestGroups: [RequestGroup]
    }
`

export { typeDefs }
