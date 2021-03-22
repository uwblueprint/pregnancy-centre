import { ClientInterface } from '../models/clientModel'
import { RequestGroupInterface } from '../models/requestGroupModel'
import { RequestInterface } from '../models/requestModel'
import { RequestTypeInterface } from '../models/requestTypeModel'
import { ServerResponseInterface } from './serverResponse'
import { Types } from 'mongoose'
import { UserInputError } from 'apollo-server-errors'

const softDeleteRequestTypeHelper = (id, dataSources): Promise<ServerResponseInterface> => {
  const requestType = dataSources.requestTypes.getById(id)
  requestType.requests.map(id => {dataSources.requests.softDelete(id)})
  return dataSources.requestTypes.softDelete(id)
}

const filterOpenRequests = (requests: Array<RequestInterface> ) => {
  return requests.filter(request => request.fulfilled === false && request.deleted === false)
}

const filterFulfilledRequests = (requests: Array<RequestInterface> ) => {
  return requests.filter(request => request.fulfilled === false && request.deleted === false)
}

const filterDeletedRequests = (requests: Array<RequestInterface> ) => {
  return requests.filter(request => request.deleted === true)
}

const getRequestsById = (requestIds, dataSources) => {
  return requestIds.map(id => dataSources.requests.getById(id))
}

const updateRequestGroupHelper = (requestGroup, dataSources, dateUpdated = Date.now()): Promise<ServerResponseInterface> => {
  requestGroup.dateUpdated = dateUpdated;
  return dataSources.requestGroups.update(requestGroup)
    .then(res => {
      return res
    })
    .catch(error => {
      return error
    })
}

const updateRequestTypeHelper = (requestType, dataSources, dateUpdated = Date.now()): Promise<ServerResponseInterface> => {
  if(!requestType.id) {
    throw new UserInputError('Missing argument value', { argumentName: 'id' })
  }
  const requestGroupId = dataSources.requestTypes.getById(requestType.id).requestGroup
  requestType.dateUpdated = dateUpdated
  return dataSources.requestTypes.update(requestType)
    .then(res => {
      const requestGroup = dataSources.requestGroups.getById(requestGroupId.toString())
      updateRequestGroupHelper(requestGroup, dataSources, requestType.dateUpdated)
      return res
    })
    .catch(error => {
      return error
    })
}

const updateRequestHelper = (request, dataSources): Promise<ServerResponseInterface> => {
  if(!request.id) {
    throw new UserInputError('Missing argument value', { argumentName: 'id' })
  }
  const requestTypeId = dataSources.requests.getById(request.id).requestType
  request.dateUpdated = Date.now()
  return dataSources.requests.update(request)
    .then(res => {
      const requestType = dataSources.requestTypes.getById(requestTypeId.toString())
      console.log(requestType)
      updateRequestTypeHelper(requestType, dataSources, request.dateUpdated)
      return res
    })
    .catch(error => {
      return error
    })
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
    requestTypes: (parent, __, { dataSources }): Array<RequestTypeInterface> => parent.requestTypes.map(id => dataSources.requestTypes.getById(Types.ObjectId(id)))
  },
  RequestType: {
    numOpen: (parent, __, { dataSources }): Number => filterOpenRequests(getRequestsById(parent.requests, dataSources)).length,
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
