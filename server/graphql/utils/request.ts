import { ClientSession, Document, Types } from 'mongoose'
import { RequestInterface } from '../../models/requestModel'
import { UserInputError } from 'apollo-server-errors'

import { updateRequestTypeHelper } from './requestType'

import mongoose from 'mongoose'

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

const updateRequestHelper = async (request, dataSources, session): Promise<Document> => {
  if(!request.id) {
    throw new UserInputError('Missing argument value', { argumentName: 'id' })
  }
  const currentRequest = dataSources.requests.getById(request.id.toString())
  const oldRequestTypeId = currentRequest.requestType.toString()
  if(request.fulfilled === true && currentRequest.fulfilled === false) {
    request.dateFulfilled = Date.now()
  }
  if(request.requestType) {
    const newRequestTypeId = request.requestType.toString()
    const oldRequestType = dataSources.requestTypes.getById(oldRequestTypeId)
    const newRequestType = dataSources.requestTypes.getById(newRequestTypeId)
    oldRequestType.requests = oldRequestType.requests.filter(id => !id.equals(request.id))
    newRequestType.requests.push(request.id)
    await updateRequestTypeHelper({"id": oldRequestTypeId, "requests": oldRequestType.requests}, dataSources, session)
    await updateRequestTypeHelper({"id": newRequestTypeId, "requests": newRequestType.requests}, dataSources, session)
    request.requestType = Types.ObjectId(request.requestType)
  }
  else {
    await updateRequestTypeHelper({"id": oldRequestTypeId}, dataSources, session)
  }
  const res = await dataSources.requests.update(request, session)
  return res
}

const softDeleteRequestHelper = async (id, dataSources) => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const res = await dataSources.requests.softDelete(id)
    await session.commitTransaction()
    return res
  }
  catch(error) {
    console.log(error)
    await session.abortTransaction()
  }
  finally {
    session.endSession()
  }
}

export { filterDeletedRequests, filterOpenRequests, filterFulfilledRequests, getRequestsById, softDeleteRequestHelper, updateRequestHelper }
