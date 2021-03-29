import { ClientInterface } from '../models/clientModel'
import { RequestGroupInterface } from '../models/requestGroupModel'
import { RequestInterface } from '../models/requestModel'
import { RequestTypeInterface } from '../models/requestTypeModel'
import { ServerResponseInterface } from './serverResponse'
import { Types } from 'mongoose'

import { filterDeletedRequests, filterOpenRequests, filterFulfilledRequests, getRequestsById, updateRequestHelper } from './utils/request'
import { softDeleteRequestTypeHelper, updateRequestTypeHelper } from './utils/requestType'
import { updateRequestGroupHelper } from './utils/requestGroup'

const nextRequestRequestTypeHelper = (requestIds, dataSources): RequestInterface => {
  const requests = requestIds.map((id) => dataSources.requests.getById(id)).filter(request => request.fulfilled === false && request.deleted === false);
  requests.sort((request1, request2) => request1.dateCreated - request2.dateCreated)
  return requests.length == 0 ? null : requests[0]
}

const nextRequestRequestGroupHelper = (requestTypeIds, dataSources): RequestInterface => {
  const requests = requestTypeIds.map((id) => {
    const requestType = dataSources.requestTypes.getById(id)
    return nextRequestRequestTypeHelper(requestType.requests, dataSources)
  })
  requests.sort((request1, request2) => {
    if (!request1 && !request2) {
      return 0
    }
    if (!request1) {
      return 1
    }
    if (!request2) {
      return -1
    }
    return request1.dateCreated - request2.dateCreated
  })
  return requests.length == 0 ? null : requests[0]
}

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
    updateRequestGroup: (_, { requestGroup }, { dataSources }): Promise<ServerResponseInterface> => {
      return updateRequestGroupHelper(requestGroup, dataSources)
    },
    softDeleteRequestGroup: (_, { id }, { dataSources }): Promise<ServerResponseInterface> => {
      const requestGroup = dataSources.requestGroups.getById(id)
      requestGroup.requestTypes.map(id => {
        softDeleteRequestTypeHelper(id, dataSources)
      })
      return dataSources.requestGroups.softDelete(id)
    },
    createRequestType: (_, { requestType }, { dataSources }): Promise<ServerResponseInterface> => dataSources.requestTypes.create(requestType),
    updateRequestType: (_, { requestType }, { dataSources }): Promise<ServerResponseInterface> => {
      return updateRequestTypeHelper(requestType, dataSources)
    },
    softDeleteRequestType: (_, { id }, { dataSources}): Promise<ServerResponseInterface> => {
      return softDeleteRequestTypeHelper(id, dataSources)
    },
    createRequest: (_, { request }, { dataSources }): Promise<ServerResponseInterface> => dataSources.requests.create(request),
    updateRequest: (_, { request }, { dataSources }): Promise<ServerResponseInterface> => {
      return updateRequestHelper(request, dataSources)
    },
    softDeleteRequest: (_, { id }, { dataSources}): Promise<ServerResponseInterface> => dataSources.requests.softDelete(id),
    createClient: (_, { client }, { dataSources }): Promise<ServerResponseInterface> => dataSources.clients.create(client),
    updateClient: (_, { client }, { dataSources }): Promise<ServerResponseInterface> => dataSources.clients.update(client),
    softDeleteClient: (_, { id }, { dataSources}): Promise<ServerResponseInterface> => dataSources.clients.softDelete(id)
  },
  RequestGroup: {
    numOpen: (parent, __, { dataSources }): Number => parent.requestTypes.map(id => dataSources.requestTypes.getById(Types.ObjectId(id)).requests.length).reduce((total, num) => total + num, 0),
    nextRecipient: (parent, __, { dataSources }): ClientInterface => { 
      const nextRequest = nextRequestRequestGroupHelper(parent.requestTypes, dataSources)
      return nextRequest ? dataSources.clients.getById(nextRequest.client) : null
    },
    requestTypes: (parent, __, { dataSources }): Array<RequestTypeInterface> => parent.requestTypes.map(id => dataSources.requestTypes.getById(Types.ObjectId(id)))
  },
  RequestType: {
    numOpen: (parent, __, { dataSources }): Number => filterOpenRequests(getRequestsById(parent.requests, dataSources)).length,
    nextRecipient: (parent, __, { dataSources }): ClientInterface => { 
      const nextRequest = nextRequestRequestTypeHelper(parent.requests, dataSources)
      return nextRequest ? dataSources.clients.getById(nextRequest.client) : null
    },
    openRequests: (parent, __, { dataSources }): Array<RequestInterface> => filterOpenRequests(getRequestsById(parent.requests, dataSources)),
    fulfilledRequests: (parent, __, { dataSources }): Array<RequestInterface> => filterFulfilledRequests(getRequestsById(parent.requests, dataSources)),
    deletedRequests: (parent, __, { dataSources }): Array<RequestInterface> => filterDeletedRequests(getRequestsById(parent.requests, dataSources)),
    requests: (parent, __, { dataSources }): Array<RequestInterface> => getRequestsById(parent.requests, dataSources),
    requestGroup: (parent, __, { dataSources }): RequestGroupInterface => dataSources.requestGroups.getById(Types.ObjectId(parent.requestGroup.toString()))
  },
  Request: {
    requestType: (parent, __, { dataSources }): RequestTypeInterface => dataSources.requestTypes.getById(Types.ObjectId(parent.requestType.toString())),
    client: (parent, __, { dataSources }): ClientInterface => dataSources.clients.getById(Types.ObjectId(parent.client))
  }
}

export { resolvers }
