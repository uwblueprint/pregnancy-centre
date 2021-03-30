import { ClientInterface } from '../models/clientModel'
import { RequestGroupInterface } from '../models/requestGroupModel'
import { RequestInterface } from '../models/requestModel'
import { RequestTypeInterface } from '../models/requestTypeModel'
import { ServerResponseInterface } from './serverResponse'
import { Types } from 'mongoose'

import { filterDeletedRequests, filterOpenRequests, filterFulfilledRequests, getRequestsById, updateRequestHelper } from './utils/request'
import { softDeleteRequestTypeHelper, updateRequestTypeHelper } from './utils/requestType'
import { softDeleteRequestGroupHelper, updateRequestGroupHelper } from './utils/requestGroup'


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
    createRequestGroup: (_, { requestGroup }, { dataSources }): Promise<ServerResponseInterface> => {
      return dataSources.requestGroups.create(requestGroup)
        .then(res => {
          return {
            'success': true,
            'message': 'RequestGroup successfully created',
            'id': res._id
          }
        })
    },
    updateRequestGroup: (_, { requestGroup }, { dataSources }): Promise<ServerResponseInterface> => {
      return updateRequestGroupHelper(requestGroup, dataSources)
        .then(res => {
          return {
            'success': true,
            'message': 'RequestGroup successfully updated',
            'id': res._id
          }
        })
    },
    softDeleteRequestGroup: (_, { id }, { dataSources }): Promise<ServerResponseInterface> => {
      return softDeleteRequestGroupHelper(id, dataSources)
        .then(res => {
          return {
            'success': true,
            'message': 'RequestGroup successfully soft deleted',
            'id': res._id
          }
        })
    },
    createRequestType: (_, { requestType }, { dataSources }): Promise<ServerResponseInterface> => {
      return dataSources.requestTypes.create(requestType)
        .then(res => {
          return {
            'success': true,
            'message': 'RequestType successfully created',
            'id': res._id
          }
        })
    },
    updateRequestType: (_, { requestType }, { dataSources }): Promise<ServerResponseInterface> => {
      return updateRequestTypeHelper(requestType, dataSources)
        .then(res => {
          return {
            'success': true,
            'message': 'RequestType successfully updated',
            'id': res._id
          }
        })
    },
    softDeleteRequestType: (_, { id }, { dataSources}): Promise<ServerResponseInterface> => {
      return softDeleteRequestTypeHelper(id, dataSources)
        .then(res => {
          return {
            'success': true,
            'message': 'RequestType successfully soft deleted',
            'id': res._id
          }
        })
    },
    createRequest: (_, { request }, { dataSources }): Promise<ServerResponseInterface> => {
      return dataSources.requests.create(request)
        .then(res => {
          return {
            'success': true,
            'message': 'Request successfully created',
            'id': res._id
          }
        })
    },
    updateRequest: (_, { request }, { dataSources }): Promise<ServerResponseInterface> => {
      return updateRequestHelper(request, dataSources)
      .then(res => {
        return {
          'success': true,
          'message': 'Request successfully updated',
          'id': res._id
        }
      })
    },
    softDeleteRequest: (_, { id }, { dataSources}): Promise<ServerResponseInterface> => {
      return dataSources.requests.softDelete(id)
        .then(res => {
          return {
            'success': true,
            'message': 'Request successfully soft deleted',
            'id': res._id
          }
        })
    },
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
