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
  if(request.fulfilled) {
    request.dateFulfilled = Date.now()
  }
  const currentRequest = dataSources.requests.getById(request.id.toString())
  if(request.requestType) {

    // If these throw, then there is nothing to revert and error should be returned to Apollo
    const originalPreviousRequestType = dataSources.requestTypes.getById(currentRequest.requestType.toString())
    const originalNewRequestType = dataSources.requestTypes.getById(request.requestType.toString())
    try {
      const previousRequestType = dataSources.requestTypes.getById(currentRequest.requestType.toString())
      const newRequestType = dataSources.requestTypes.getById(request.requestType.toString())
      previousRequestType.requests = previousRequestType.requests.filter(item => {
        return !item.equals(request.id)
      })
      newRequestType.requests.push(currentRequest._id)
      dataSources.requestTypes.update(newRequestType)
      dataSources.requestTypes.update(previousRequestType)
      
      
    }
    catch(error) {
      console.log(error)
    }

  }
  const requestTypeId = currentRequest.requestType
  return dataSources.requests.update(request)
    .then(res => {
      updateRequestTypeHelper({"id": requestTypeId}, dataSources)
      return res
    })
}

export { filterDeletedRequests, filterOpenRequests, filterFulfilledRequests, getRequestsById, updateRequestHelper }
