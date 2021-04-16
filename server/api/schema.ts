import { gql } from 'apollo-server'

// TODO: date types

const typeDefs = gql`
    type Client {
        _id: ID
        fullName: String
        updatedAt: String
        createdAt: String
        deletedAt: String
    }
    input ClientInput {
        _id: ID
        fullName: String
    }
    input ClientFilterInput {
        fullName: String
    }

    type Request {
        _id: ID
        quantity: Int
        requestType: RequestType
        client: Client
        updatedAt: String
        createdAt: String
        deletedAt: String
        fulfilledAt: String
    }
    input RequestInput {
        _id: ID
        quantity: Int
        requestType: ID
        client: ID
    }
    input RequestFilterInput {
    }

    type RequestType {
        _id: ID
        name: String
        numOpen: Int
        requestGroup: RequestGroup
        requests: [Request]
        createdAt: String
        updatedAt: String
        deletedAt: String
        
        openRequests: [Request]
        fulfilledRequests: [Request]
        deletedRequests: [Request]
        nextRecipient: Client
    }
    input RequestTypeInput {
        _id: ID
        name: String
        requestGroup: ID
        requests: [ID]
    }
    input RequestTypeFilterInput {
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

        numOpen: Int
        hasAnyRequests: Boolean
        nextRecipient: Client
    }
    input RequestGroupInput {
        id: ID
        name: String
        description: String
        image: String
        requestTypes: [ID]
    }
    input RequestGroupFilterInput {
    }

    type FilterOptions {
    }

    type Query {
        client(_id: ID): Client
        clients: [Client]
        clientsFilter(filter: ClientFilterInput, options: FilterOptions): [Client]

        request(_id: ID): Request
        requests: [Request]
        requestsFilter(filter: RequestFilterInput, options: FilterOptions): [Request]

        requestType(_id: ID): RequestType
        requestTypes: [RequestType]
        requestTypesFilter(filter: RequestTypeFilterInput, options: FilterOptions): [RequestType]

        requestGroup(_id: ID): RequestGroup
        requestGroups: [RequestGroup]
        requestGroupsFilter(filter: RequestGroupFilterInput, options: FilterOptions): [RequestGroup]
    }

    type Mutation {
        createClient(client: ClientInput): Client
        updateClient(client: ClientInput): Client
        deleteClient(_id: ID): Client

        createRequest(request: RequestInput): Request
        updateRequest(request: RequestInput): Request
        deleteRequest(_id: ID): Request
        fulfillRequest(_id: ID): Request

        createRequestType(requestType: RequestTypeInput): RequestType
        updateRequestType(requestType: RequestTypeInput): RequestType
        deleteRequestType(_id: ID): RequestType
        addRequestFromRequestType(_id: ID): RequestType
        removeRequestFromRequestType(_id: ID): RequestType

        createRequestGroup(requestGroup: RequestGroupInput): RequestGroup
        updateRequestGroup(requestGroup: RequestGroupInput): RequestGroup
        deleteRequestGroup(_id: ID): RequestGroup
        addRequestTypeFromRequestGroup(_id: ID): RequestGroup
        removeRequestTypeFromRequestGroup(_id: ID): RequestGroup
    }
`

export { typeDefs }
