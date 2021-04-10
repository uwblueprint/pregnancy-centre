import { gql } from 'apollo-server'

// TODO: date types

const typeDefs = gql`
    type Client {
        _id: ID
        clientId: String
        fullName: String
        deleted: Boolean
    }
    type Request {
        _id: ID
        requestType: RequestType
        requestId: String
        client: Client
        dateUpdated: String
        dateCreated: String
        dateFulfilled: String
        deleted: Boolean
        fulfilled: Boolean
        quantity: Int
    }
    type RequestType {
        _id: ID
        requestGroup: RequestGroup
        name: String
        dateUpdated: String
        deleted: Boolean
        requests: [Request]
        openRequests: [Request]
        fulfilledRequests: [Request]
        deletedRequests: [Request]
        numOpen: Int,
        nextRecipient: Client
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
        numOpen: Int,
        hasAnyRequests: Boolean,
        nextRecipient: Client
    }
    type ServerResponse {
        success: Boolean
        message: String
        id: ID
    }
    type Query {
        client(id: ID): Client
        filterClients(filter: ClientInput): [Client]
        clients: [Client]
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
        description: String
        requirements: String
        image: String
        requestTypes: [ID]
    }
    input RequestTypeInput {
        id: ID
        requestGroup: ID
        name: String
        requests: [ID]
    }
    input RequestInput {
        id: ID
        client: ID
        requestType: ID
        requestId: String
        fulfilled: Boolean
        quantity: Int
    }
    input ClientInput {
        id: ID
        clientId: String
        fullName: String
    }
`

export { typeDefs }
