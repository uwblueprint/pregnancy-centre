import { gql } from "apollo-server";

const typeDefs = gql`
    type Request {
        _id: ID
        quantity: Int
        clientName: String
        requestType: RequestType
        matchedDonations: [DonationForm]

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
        clientName: String
    }
    input UpdateRequestInput {
        _id: ID!
        quantity: Int
        requestType: ID
        clientName: String
    }
    # ---  Left as a proof of concept: ---
    # input FilterRequestInput {
    #     NOT_AVAILABLE: Boolean
    # }

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
        nextRecipient: String
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
    # ---  Left as a proof of concept: ---
    # input FilterRequestTypeInput {
    #     NOT_AVAILABLE: Boolean
    # }

    type RequestGroup {
        _id: ID
        name: String
        description: String
        image: String
        requestTypes: [RequestType]
        donationForms: [DonationForm]

        createdAt: String
        updatedAt: String
        deletedAt: String

        deleted: Boolean

        countOpenRequests: Int
        nextRequest: Request
        nextRecipient: String
        hasAnyRequests: Boolean
    }
    input CreateRequestGroupInput {
        name: String!
        description: String
        image: String
    }
    input UpdateRequestGroupInput {
        _id: ID!
        name: String
        description: String
        image: String
        requestTypes: [ID]
    }
    # ---  Left as a proof of concept: ---
    # input FilterRequestGroupInput {
    #     NOT_AVAILABLE: Boolean
    # }

    # input FilterOptions {
    #     NOT_AVAILABLE: Boolean
    # }

    enum DonationItemCondition {
        BRAND_NEW
        GREAT
        GOOD
        FAIR
        POOR
    }

    enum DonationItemStatus {
        PENDING_APPROVAL
        PENDING_DROPOFF
        PENDING_MATCH
    }

    type DonationFormContact {
        firstName: String
        lastName: String
        email: String
        phoneNum: String
    }

    type DonationForm {
        _id: ID
        contact: DonationFormContact
        name: String
        requestGroup: RequestGroup
        description: String
        quantity: Int
        age: Int
        condition: DonationItemCondition
        images: [String]

        adminNotes: String
        status: DonationItemStatus
        quantityMatched: Int

        createdAt: String
        updatedAt: String
    }

   
    type Query {
        request(_id: ID): Request
        requests: [Request]
        requestsPage(skip: Int, limit: Int): [Request]
        countRequests(open: Boolean): Int
        # --- Left as a proof of concept: ---
        # requestsFilter(filter: FilterRequestInput, options: FilterOptions): [Request]

        requestType(_id: ID): RequestType
        requestTypes: [RequestType]
        requestTypesPage(skip: Int, limit: Int): [RequestType]
        countRequestTypes(open: Boolean): Int
        # --- Left as a proof of concept: ---
        # requestTypesFilter(filter: FilterRequestTypeInput, options: FilterOptions): [RequestType]

        requestGroup(_id: ID): RequestGroup
        requestGroups: [RequestGroup]
        requestGroupsPage(skip: Int, limit: Int, name: String): [RequestGroup]
        countRequestGroups(open: Boolean): Int
        # --- Left as a proof of concept: ---
        # requestGroupsFilter(filter: FilterRequestGroupInput, options: FilterOptions): [RequestGroup]

        donationForm(_id: ID): DonationForm
        donationForms: [DonationForm]
    }

    type Mutation {
        createRequest(request: CreateRequestInput): Request
        updateRequest(request: UpdateRequestInput): Request
        deleteRequest(_id: ID): Request
        fulfillRequest(_id: ID): Request
        unfulfillRequest(_id: ID): Request
        changeRequestTypeForRequest(requestId: ID, requestTypeId: ID): Request

        createRequestType(requestType: CreateRequestTypeInput): RequestType
        updateRequestType(requestType: UpdateRequestTypeInput): RequestType
        deleteRequestType(_id: ID): RequestType
        changeRequestGroupForRequestType(requestTypeId: ID, requestGroupId: ID): Request

        createRequestGroup(requestGroup: CreateRequestGroupInput): RequestGroup
        updateRequestGroup(requestGroup: UpdateRequestGroupInput): RequestGroup
        deleteRequestGroup(_id: ID): RequestGroup
    }
`;

export { typeDefs };
