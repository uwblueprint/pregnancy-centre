import { ClientInterface } from '../models/clientModel'
import { RequestGroupInterface } from '../models/requestGroupModel'
import { RequestInterface } from '../models/requestModel'
import { RequestTypeInterface } from '../models/requestTypeModel'
import { ServerResponseInterface } from './serverResponse'
import { Types } from 'mongoose'

import mongoose from 'mongoose'

import { filterDeletedRequests, filterOpenRequests, filterFulfilledRequests, getRequestsById, softDeleteRequestHelper, updateRequestHelper } from './utils/request'
import { softDeleteRequestGroupHelper, updateRequestGroupHelper } from './utils/requestGroup'
import { softDeleteRequestTypeHelper, updateRequestTypeHelper } from './utils/requestType'


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
    filterClient: (_, { id, clientId, fullName, deleted }, { dataSources }): Array<ClientInterface> => {
      const clients = dataSources.clients.getAll()

      return clients.filter((client) => (id ? client._id.equals(Types.ObjectId(id)) : true) 
                                        && (clientId ? client.clientId === clientId : true)
                                        && (fullName ? client.fullName === fullName : true)
                                        && (deleted ? client.deleted === deleted : true))
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
    createClient: (_, { client }, { dataSources }): Promise<ServerResponseInterface> => dataSources.clients.create(client),
    updateClient: (_, { client }, { dataSources }): Promise<ServerResponseInterface> => dataSources.clients.update(client),
    softDeleteClient: (_, { id }, { dataSources}): Promise<ServerResponseInterface> => dataSources.clients.softDelete(id)
  },
  RequestGroup: {
    numOpen: (parent, __, { dataSources }): Number => 
      parent.requestTypes.map(id => {
        return filterOpenRequests(getRequestsById(dataSources.requestTypes.getById(Types.ObjectId(id)).requests, dataSources)).length
      }).reduce((total, num) => total + num, 0),
    hasAnyRequests: (parent, __, { dataSources }): Boolean => 
      parent.requestTypes.map(id => dataSources.requestTypes.getById(Types.ObjectId(id)).requests.length).reduce((notEmpty, len) => notEmpty || len > 0),
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

const sessionHandler = async (operation) => {
  const session = await mongoose.startSession()
  let res = null
  try {
    await session.withTransaction(async () => {
      res = await operation(session)
    })
  }
  catch(error) {
    console.log(error)
    throw error
  }
  session.endSession()
  return res
}

export { resolvers }
