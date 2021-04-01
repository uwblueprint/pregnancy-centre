import { Document, Types } from 'mongoose'
import { RequestInterface } from '../../models/requestModel'
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

const revertUpdates = (request, dataSources, currentRequestCopy, oldRequestTypeCopy, newRequestTypeCopy) => {
  dataSources.requests.update(currentRequestCopy)
  if(request.requestType) {
    dataSources.requestTypes.update(oldRequestTypeCopy)
    dataSources.requestTypes.update(newRequestTypeCopy)
  }
}

const updateRequestHelper = async (request, dataSources): Promise<Document> => {
  if(!request.id) {
    throw new UserInputError('Missing argument value', { argumentName: 'id' })
  }

  const currentRequest = dataSources.requests.getById(request.id.toString())
  const currentRequestCopy = currentRequest.toObject()
  currentRequestCopy.id = currentRequestCopy._id
  let oldRequestTypeCopy, newRequestTypeCopy

  if(request.requestType) {
    // If these fail then nothing has been changed at this point, so nothing to revert
    oldRequestTypeCopy = dataSources.requestTypes.getById(currentRequest.requestType.toString()).toObject()
    oldRequestTypeCopy.id = oldRequestTypeCopy._id
    newRequestTypeCopy = dataSources.requestTypes.getById(request.requestType.toString()).toObject()
    newRequestTypeCopy.id = newRequestTypeCopy._id
  }

  if(request.fulfilled === true && currentRequest.fulfilled === false) {
    request.dateFulfilled = Date.now()
  }

  try {

    if(request.requestType) {
      const oldRequestType = dataSources.requestTypes.getById(currentRequest.requestType.toString())
      const newRequestType = dataSources.requestTypes.getById(request.requestType.toString())
      oldRequestType.requests = oldRequestType.requests.filter(id => !id.equals(request.id))
      newRequestType.requests.push(request.id)
      await dataSources.requestTypes.update(oldRequestType)
      await dataSources.requestTypes.update(newRequestType)

      currentRequest.requestType = request.requestType
      request.requestType = Types.ObjectId(request.requestType)
    }

    const requestTypeId = currentRequest.requestType.toString()
    return dataSources.requests.update(request)
      .then(res => {
        updateRequestTypeHelper({"id": requestTypeId}, dataSources)
        return res
      })
      .catch(error => {
        console.log(error);
        // Reverting to original copies
        revertUpdates(request, dataSources, currentRequestCopy, oldRequestTypeCopy, newRequestTypeCopy)
        throw error
      })
  }
  catch(error) {
    console.log(error)
    // Reverting to original copies
    revertUpdates(request, dataSources, currentRequestCopy, oldRequestTypeCopy, newRequestTypeCopy)
    throw error
  }
}

export { filterDeletedRequests, filterOpenRequests, filterFulfilledRequests, getRequestsById, updateRequestHelper }
