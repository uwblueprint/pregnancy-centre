import { gql } from 'apollo-server'

// TODO: date types

const typeDefs = gql`
    type Request {
        _id: ID
        request_id: String
        date_created: String
        date_fulfilled: String
        deleted: Boolean
        fulfilled: Boolean
        tags: [Tag]
    }
    type RequestListing {
        openRequests: [ID]
        fulfilledRequests: [ID]
        deletedRequests: [ID]
    }
    type RequestType {
        _id: ID
        name: String
        requests: RequestListing
    }
    type RequestGroup {
        _id: ID
        name: String
        description: String
        requirements: String
        image: String
        requestTypes: [RequestType]
    }
    type Query {
        request(id: ID): Request
        requests: [Request]
    }
`

export { typeDefs }
