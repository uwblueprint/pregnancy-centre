import { Document } from 'mongoose'
import { RequestInterface } from '../../models/requestModel'
import { ServerResponseInterface } from '../serverResponse'
import { UserInputError } from 'apollo-server-errors'

import { updateRequestTypeHelper } from './requestType'

const filterOpenRequests = (requests: Array<RequestInterface> ) => {
  return requests.filter(request => request.fulfilled === false && request.deleted === false)
}

const filterFulfilledRequests = (requests: Array<RequestInterface> ) => {
  return requests.filter(request => request.fulfilled === true && request.deleted === false)
}

const filterDeletedRequests = (requests: Array<RequestInterface> ) => {
  return requests.filter(request => request.deleted === true)
}

const getRequestsById = (requestIds, dataSources) => {
  return requestIds.map(id => dataSources.requests.getById(id))
}

const updateRequestHelper = (request, dataSources): Promise<Document> => {
  if(!request.id) {
    throw new UserInputError('Missing argument value', { argumentName: 'id' })
  }
  const requestTypeId = dataSources.requests.getById(request.id.toString()).requestType
  return dataSources.requests.update(request)
    .then(res => {
      updateRequestTypeHelper({"id": requestTypeId}, dataSources)
      return res
    })
}

export { filterDeletedRequests, filterOpenRequests, filterFulfilledRequests, getRequestsById, updateRequestHelper }
