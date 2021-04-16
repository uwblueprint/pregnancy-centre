import { gql } from 'apollo-server'

const typeDefs = gql`
    type Client {
        _id: ID
        fullName: String

        createdAt: String
        updatedAt: String
        deletedAt: String

        deleted: Boolean
    }
    input CreateClientInput {
        fullName: String!
    }
    input UpdateClientInput {
        _id: ID!
        fullName: String
    }
    input FilterClientInput {
        fullName: String!
    }

    type Request {
        _id: ID
        quantity: Int
        requestType: RequestType
        client: Client

        createdAt: String
        updatedAt: String
        deletedAt: String
        fulfilledAt: String

        deleted: Boolean
        fulfilled: Boolean
    }
    input CreateRequestInput {
        quantity: Int
        requestType: ID!
        client: ID
    }
    input UpdateRequestInput {
        _id: ID!
        quantity: Int
        requestType: ID
        client: ID
    }
    input FilterRequestInput {
        NOT_AVAILABLE: Boolean
    }

    type RequestType {
        _id: ID
        name: String
        requestGroup: RequestGroup
        requests: [Request]

        createdAt: String
        updatedAt: String
        deletedAt: String

        deleted: Boolean
        
        openRequests: [Request]
        fulfilledRequests: [Request]
        deletedRequests: [Request]
        countOpenRequests: Int
        nextRequest: Request
        nextRecipient: Client
    }
    input CreateRequestTypeInput {
        name: String!
        requestGroup: ID!
        requests: [ID]
    }
    input UpdateRequestTypeInput {
        _id: ID!
        name: String
        requestGroup: ID
        requests: [ID]
    }
    input FilterRequestTypeInput {
        NOT_AVAILABLE: Boolean
    }

    type RequestGroup {
        _id: ID
        name: String
        description: String
        image: String
        requestTypes: [RequestType]

        createdAt: String
        updatedAt: String
        deletedAt: String

        deleted: Boolean

        countOpenRequests: Int
        nextRequest: Request
        nextRecipient: Client
        hasAnyRequests: Boolean
    }
    input CreateRequestGroupInput {
        name: String!
        description: String
        image: String
        requestTypes: [ID]
    }
    input UpdateRequestGroupInput {
        _id: ID!
        name: String
        description: String
        image: String
        requestTypes: [ID]
    }
    input FilterRequestGroupInput {
        NOT_AVAILABLE: Boolean
    }

    input FilterOptions {
        NOT_AVAILABLE: Boolean
    }

    type Query {
        client(_id: ID): Client
        clients: [Client]
        clientsFilter(filter: FilterClientInput, options: FilterOptions): [Client]

        request(_id: ID): Request
        requests: [Request]
        requestsFilter(filter: FilterRequestInput, options: FilterOptions): [Request]

        requestType(_id: ID): RequestType
        requestTypes: [RequestType]
        requestTypesFilter(filter: FilterRequestTypeInput, options: FilterOptions): [RequestType]

        requestGroup(_id: ID): RequestGroup
        requestGroups: [RequestGroup]
        requestGroupsFilter(filter: FilterRequestGroupInput, options: FilterOptions): [RequestGroup]
    }

    type Mutation {
        createClient(client: CreateClientInput): Client
        updateClient(client: UpdateClientInput): Client
        deleteClient(_id: ID): Client

        createRequest(request: CreateRequestInput): Request
        updateRequest(request: UpdateRequestInput): Request
        deleteRequest(_id: ID): Request
        fulfillRequest(_id: ID): Request
        changeRequestTypeForRequest(request: ID, requestType: ID): Request

        createRequestType(requestType: CreateRequestTypeInput): RequestType
        updateRequestType(requestType: UpdateRequestTypeInput): RequestType
        deleteRequestType(_id: ID): RequestType
        changeRequestGroupForRequestType(requestType: ID, requestGroup: ID): Request

        createRequestGroup(requestGroup: CreateRequestGroupInput): RequestGroup
        updateRequestGroup(requestGroup: UpdateRequestGroupInput): RequestGroup
        deleteRequestGroup(_id: ID): RequestGroup
    }
`

export { typeDefs }
