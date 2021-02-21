import { gql } from 'apollo-server'

// TODO: date types

const typeDefs = gql`
    type Request {
        _id: ID
        request_id: String
        client_id: String
        date_created: String
        date_fulfilled: String
        deleted: Boolean
        fulfilled: Boolean
    }
    type RequestListing {
        open: [ID]
        fulfilled: [ID]
        deleted: [ID]
    }
    type RequestType {
        _id: ID
        name: String
        deleted: Boolean
        requests: RequestListing
    }
    type RequestGroup {
        _id: ID
        name: String
        description: String
        deleted: Boolean
        requirements: String
        image: String
        requestTypes: [RequestType]
    }
    type Query {
        request(id: ID): Request
        requests: [Request]
        requestType(id: ID): RequestType
        requestTypes: [RequestType]
        requestGroup(id: ID): RequestGroup
        requestGroups: [RequestGroup]
    }
`

export { typeDefs }
