import { gql } from 'apollo-server'

// TODO: date types

const typeDefs = gql`
    type Client {
        _id: ID
        clientId: String
        firstName: String
        lastName: String
        deleted: Boolean
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
    type RequestType {
        _id: ID
        name: String
        dateUpdated: String
        deleted: Boolean
        requests: [Request]
        openRequests: [Request]
        fulfilledRequests: [Request]
        deletedRequests: [Request]
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
        createRequestGroup(requestGroup: RequestGroupInput): ServerResponse
        updateRequestGroup(requestGroup: RequestGroupInput): ServerResponse
        softDeleteRequestGroup(id: ID): ServerResponse
        createRequestType(requestType: RequestTypeInput): ServerResponse
        updateRequestType(requestType: RequestTypeInput): ServerResponse
        softDeleteRequestType(id: ID): ServerResponse
        createRequest(request: RequestInput): ServerResponse
        updateRequest(request: RequestInput): ServerResponse
        softDeleteRequest(id: ID): ServerResponse
        createClient(client: ClientInput): ServerResponse
        updateClient(client: ClientInput): ServerResponse
        softDeleteClient(id: ID): ServerResponse
    }
    input RequestGroupInput {
        id: ID
        name: String
        deleted: Boolean
        description: String
        requirements: String
        image: String
        requestTypes: [ID]
    }
    input RequestTypeInput {
        id: ID
        name: String
        deleted: Boolean
        requests: [ID]
    }
    input RequestInput {
        id: ID
        client: ID
        requestId: String
        deleted: Boolean
        fulfilled: Boolean
    }
    input ClientInput {
        id: ID
        clientId: String
        firstName: String
        lastName: String
    }
`

export { typeDefs }
