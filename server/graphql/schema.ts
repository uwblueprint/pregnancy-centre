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
        client: Client
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
    type ServerResponse {
        success: Boolean
        message: String
        id: ID
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
    type Mutation {
        createRequestType(requestType: RequestTypeInput): ServerResponse
        updateRequestType(requestType: RequestTypeInput, id: ID): ServerResponse
        softDeleteRequestType(id: ID): ServerResponse
        createRequest(request: RequestInput): ServerResponse
        updateRequest(request: RequestInput, id: ID): ServerResponse
        softDeleteRequest(id: ID): ServerResponse
    }
    input RequestListingInput {
        open: [ID]
        fulfilled: [ID]
        deleted: [ID]
    }
    input RequestTypeInput {
        name: String
        deleted: Boolean
        requests: RequestListingInput
    }
    input RequestInput {
        client: ID
        requestId: String
        deleted: Boolean
        fulfilled: Boolean
    }
`

export { typeDefs }
