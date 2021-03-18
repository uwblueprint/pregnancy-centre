import { ClientInterface } from '../models/clientModel'
import { RequestGroupInterface } from '../models/requestGroupModel'
import { RequestInterface } from '../models/requestModel'
import { RequestTypeInterface } from '../models/requestTypeModel'
import { ServerResponseInterface } from './serverResponse'
import { Types } from 'mongoose'

const resolvers = {
  Query: {
    client: (_, { id }, { dataSources }): ClientInterface => dataSources.clients.getById(Types.ObjectId(id)),
    clients: (_, __, { dataSources }): Array<ClientInterface> => dataSources.clients.getAll(),
    request: (_, { id }, { dataSources }): RequestInterface => dataSources.requests.getById(Types.ObjectId(id)),
    requests: (_, __, { dataSources }): Array<RequestInterface> => dataSources.requests.getAll(),
    requestType: (_, { id }, { dataSources }): RequestTypeInterface => dataSources.requestTypes.getById(Types.ObjectId(id)),
    requestTypes: (_, __, { dataSources }): Array<RequestTypeInterface> => dataSources.requestTypes.getAll(),
    requestGroup: (_, { id }, { dataSources }): RequestGroupInterface => dataSources.requestGroups.getById(Types.ObjectId(id)),
    requestGroups: (_, __, { dataSources }): Array<RequestGroupInterface> => dataSources.requestGroups.getAll()
  },
  Mutation: {
    createRequestGroup: (_, { requestGroup }, { dataSources }): Promise<ServerResponseInterface> => dataSources.requestGroups.create(requestGroup),
    updateRequestGroup: (_, { requestGroup }, { dataSources }): Promise<ServerResponseInterface> => dataSources.requestGroups.update(requestGroup),
    softDeleteRequestGroup: (_, { id }, { dataSources }): Promise<ServerResponseInterface> => dataSources.requestGroups.softDelete(id),
    createRequestType: (_, { requestType }, { dataSources }): Promise<ServerResponseInterface> => dataSources.requestTypes.create(requestType),
    updateRequestType: (_, { requestType }, { dataSources }): Promise<ServerResponseInterface> => dataSources.requestTypes.update(requestType),
    softDeleteRequestType: (_, { id }, { dataSources}): Promise<ServerResponseInterface> => dataSources.requestTypes.softDelete(id),
    createRequest: (_, { request }, { dataSources }): Promise<ServerResponseInterface> => dataSources.requests.create(request),
    updateRequest: (_, { request }, { dataSources }): Promise<ServerResponseInterface> => dataSources.requests.update(request),
    softDeleteRequest: (_, { id }, { dataSources}): Promise<ServerResponseInterface> => dataSources.requests.softDelete(id),
    createClient: (_, { client }, { dataSources }): Promise<ServerResponseInterface> => dataSources.clients.create(client),
    updateClient: (_, { client }, { dataSources }): Promise<ServerResponseInterface> => dataSources.clients.update(client),
    softDeleteClient: (_, { id }, { dataSources}): Promise<ServerResponseInterface> => dataSources.clients.softDelete(id)
  },
  RequestGroup: {
    numOpen: (parent, __, { dataSources }): Number => parent.requestTypes.map(id => dataSources.requestTypes.getById(Types.ObjectId(id)).requests.open.length).reduce((total, num) => total + num),
    requestTypes: (parent, __, { dataSources }): Array<RequestTypeInterface> => parent.requestTypes.map(id => dataSources.requestTypes.getById(Types.ObjectId(id)))
  },
  RequestType: {
    numOpen: (parent, __, { dataSources }): Number => parent.requests.map(id => dataSources.requests.getById(id)).reduce((total, request) => (request.deleted === false && request.fulfilled === false) ? total + 1 : total, 0),
    openRequests: (parent, __, { dataSources }): Array<RequestInterface> => parent.requests.map(id => dataSources.requests.getById(id)).filter(request => request.fulfilled === false && request.deleted === false),
    fulfilledRequests: (parent, __, { dataSources }): Array<RequestInterface> => parent.requests.map(id => dataSources.requests.getById(id)).filter(request => request.fulfilled === true),
    deletedRequests: (parent, __, { dataSources }): Array<RequestInterface> => parent.requests.map(id => dataSources.requests.getById(id)).filter(request => request.deleted === true),
  },
  Request: {
    client: (parent, __, { dataSources }): ClientInterface => dataSources.clients.getById(Types.ObjectId(parent.client))
  }
}

export { resolvers }
