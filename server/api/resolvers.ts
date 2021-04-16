import { UserInputError } from 'apollo-server-errors'
import { Types } from 'mongoose'

/* DB Models */
import { Client, ClientInterface } from '../database/models/clientModel'
import { RequestGroup, RequestGroupInterface } from '../database/models/requestGroupModel'
import { Request, RequestInterface } from '../database/models/requestModel'
import { RequestType, RequestTypeInterface } from '../database/models/requestTypeModel'

/* Helper functions */
import { sessionHandler } from './utils/session'

const resolvers = {
    Query: {
        client: (_, { _id }, { authenticateUser }): ClientInterface => {
            return await authenticateUser().then(() => {
                Client.findById(_id)
                .exec()
                .then(client => {
                    return client
                })
                .catch(err => {
                    throw new UserInputError("Failed getting client")
                })
            }) 

        },
        clients: (_, __, { authenticateUser }): Array<ClientInterface> => {
            return await authenticateUser().then(() => {
                Client.find().exec()
                .then(clients => {
                    return clients
                })
                .catch(err => {
                    throw new UserInputError("Failed getting clients")
                })
            })
        },
        clientsFilter: (_, { filter, options }, { authenticateUser }): Array<ClientInterface> => {
            return await authenticateUser().then(() => {
                Client.find({ fullName: filter.fullName }).exec()
                .then(clients => {
                    return clients
                })
                .catch(err => {
                    throw new UserInputError("Failed getting clients")
                })
            })
        },

        request: (_, { _id }, { authenticateUser }): RequestInterface => {
            return await Request.findById(_id).exec()
                .then (request => {
                    return request
                })
                .catch(err => {
                    throw new UserInputError("Failed getting request")
                })
        },
        requests: (_, __, { authenticateUser }): Array<RequestInterface> => {
            return await Request.find().exec()
                .then (requests => {
                    return requests
                })
                .catch(err => {
                    throw new UserInputError("Failed getting requests")
                })
        },
        requestsFilter: (_, { filter, options }, { authenticateUser }): Array<RequestInterface> => {
            return await Request.find().exec()
                .then (requests => {
                    return requests
                })
                .catch(err => {
                    throw new UserInputError("Failed getting requests")
                })
        },

        requestType: (_, { _id }, { authenticateUser }): RequestTypeInterface => {
            return await RequestType.findById(_id).exec()
                .then (requestType => {
                    return requestType
                })
                .catch(err => {
                    throw new UserInputError("Failed getting requestType")
                })
        },
        requestTypes: (_, __, { authenticateUser }): Array<RequestTypeInterface> => {
            return await RequestType.find().exec()
                .then (requestTypes => {
                    return requestTypes
                })
                .catch(err => {
                    throw new UserInputError("Failed getting requestTypes")
                })
        },
        requestTypesFilter: (_, { filter, options }, { authenticateUser }): Array<RequestTypeInterface> => {
            return await RequestType.find().exec()
                .then (requestTypes => {
                    return requestTypes
                })
                .catch(err => {
                    throw new UserInputError("Failed getting requestTypes")
                })
        },

        requestGroup: (_, { _id }, { authenticateUser }): RequestGroupInterface => {
            return await RequestGroup.findById(_id).exec()
                .then (requestGroup => {
                    return requestGroup
                })
                .catch(err => {
                    throw new UserInputError("Failed getting requestGroup")
                })
        },
        requestGroups: (_, __, { authenticateUser }): Array<RequestGroupInterface> => {
            return await RequestGroup.find().exec()
                .then (requestGroups => {
                    return requestGroups
                })
                .catch(err => {
                    throw new UserInputError("Failed getting requestGroups")
                })
        },
        requstGroupsFilter: (_, { filter, options }, { authenticateUser }): Array<RequestGroupInterface> => {
            return await RequestGroup.find().exec()
                .then (requestGroups => {
                    return requestGroups
                })
                .catch(err => {
                    throw new UserInputError("Failed getting requestGroups")
                })
        },
    },
    
    Mutation: {
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
}

export { resolvers }
