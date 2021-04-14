import { Types } from 'mongoose'

/* Models */
import { ClientInterface } from '../models/clientModel'
import { RequestGroupInterface } from '../models/requestGroupModel'
import { RequestInterface } from '../models/requestModel'
import { RequestTypeInterface } from '../models/requestTypeModel'
import { ServerResponseInterface } from './serverResponse'

/* Helper functions */
import { createRequestGroupHelper, nextRequestRequestGroupHelper, softDeleteRequestGroupHelper, updateRequestGroupHelper } from './utils/requestGroup'
import { createRequestHelper, filterDeletedRequests, filterFulfilledRequests, filterOpenRequests, getRequestsById, softDeleteRequestHelper, updateRequestHelper } from './utils/request'
import { createRequestTypeHelper, nextRequestRequestTypeHelper, softDeleteRequestTypeHelper, updateRequestTypeHelper } from './utils/requestType'
import { createClientHelper } from './utils/client'
import { sessionHandler } from '../database/session'

const resolvers = {
  Query: {
    client: (_, { id }, { dataSources }): ClientInterface => dataSources.clients.getById(Types.ObjectId(id)),
    filterClients: (_, { filter }, { dataSources }): Array<ClientInterface> => {
      let filteredClients = dataSources.clients.getAll()

      for (const property in filter) {
        filteredClients = filteredClients.filter((client) => (client[property] ? client[property] === filter[property] : true))
      }

      return filteredClients
    },
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
      return sessionHandler(session => createRequestGroupHelper(requestGroup, dataSources, session))
        .then(res => {
          return {
            'success': true,
            'message': 'RequestGroup successfully created',
            'id': res._id
          }
        })
    },
    updateRequestGroup: (_, { requestGroup }, { dataSources }): Promise<ServerResponseInterface> => {
      return sessionHandler(session => updateRequestGroupHelper(requestGroup, dataSources, session))
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
      return sessionHandler(session => createRequestTypeHelper(requestType, dataSources, session))
        .then(res => {
          return {
            'success': true,
            'message': 'RequestType successfully created',
            'id': res._id
          }
        })
    },
    updateRequestType: (_, { requestType }, { dataSources }): Promise<ServerResponseInterface> => {
      return sessionHandler(session => updateRequestTypeHelper(requestType, dataSources, session))
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
      return sessionHandler((session) => createRequestHelper(request, dataSources, session))
        .then(res => {
          return {
            'success': true,
            'message': 'Request successfully created',
            'id': res._id
          }
        })
    },
    updateRequest: (_, { request }, { dataSources }): Promise<ServerResponseInterface> => {
      return sessionHandler((session) => updateRequestHelper(request, dataSources, session))
      .then(res => {
        return {
          'success': true,
          'message': 'Request successfully updated',
          'id': res._id
        }
      })
    },
    softDeleteRequest: (_, { id }, { dataSources}): Promise<ServerResponseInterface> => {
      return softDeleteRequestHelper(id, dataSources)
        .then(res => {
          return {
            'success': true,
            'message': 'Request successfully soft deleted',
            'id': res._id
          }
        })
    },
    createClient: (_, { client }, { dataSources }): Promise<ServerResponseInterface> => {
      return sessionHandler((session) => createClientHelper(client, dataSources, session))
      .then(res => {
        return {
          'success': true,
          'message': 'Client succesfully updated',
          'id': res._id
        }
      })
    },

    // TODO: Create helper functions for updateClient and softDeleteClient
    // TODO: Wrap updateClient and softDeleteClient helpers in sessionHandler
    updateClient: (_, { client }, { dataSources }): Promise<ServerResponseInterface> => dataSources.clients.update(client),
    softDeleteClient: (_, { id }, { dataSources}): Promise<ServerResponseInterface> => dataSources.clients.softDelete(id)
  },
  RequestGroup: {
    numOpen: (parent, __, { dataSources }): number => 
      parent.requestTypes.map(id => {
        return filterOpenRequests(getRequestsById(dataSources.requestTypes.getById(Types.ObjectId(id)).requests, dataSources)).length
      }).reduce((total, num) => total + num, 0),
    hasAnyRequests: (parent, __, { dataSources }): boolean => 
      parent.requestTypes.map(id => dataSources.requestTypes.getById(Types.ObjectId(id)).requests.length).reduce((notEmpty, len) => notEmpty || len > 0, false),
    nextRecipient: (parent, __, { dataSources }): ClientInterface => { 
      const nextRequest = nextRequestRequestGroupHelper(parent.requestTypes, dataSources)
      return nextRequest ? dataSources.clients.getById(nextRequest.client) : null
    },
    requestTypes: (parent, __, { dataSources }): Array<RequestTypeInterface> => parent.requestTypes.map(id => dataSources.requestTypes.getById(Types.ObjectId(id)))
  },
  RequestType: {
    numOpen: (parent, __, { dataSources }): number => filterOpenRequests(getRequestsById(parent.requests, dataSources)).length,
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
