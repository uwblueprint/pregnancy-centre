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

const updateRequestHelper = async (request, dataSources): Promise<Document> => {
  if(!request.id) {
    throw new UserInputError('Missing argument value', { argumentName: 'id' })
  }
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const currentRequest = dataSources.requests.getById(request.id.toString())
    const requestTypeId = currentRequest.requestType.toString()
    const res = await dataSources.requests.update(request, session)
    if(request.fulfilled === true && currentRequest.fulfilled === false) {
      request.dateFulfilled = Date.now()
    }
    if(request.requestType) {
      const oldRequestType = dataSources.requestTypes.getById(requestTypeId)
      const newRequestType = dataSources.requestTypes.getById(request.requestType.toString())
      oldRequestType.requests = oldRequestType.requests.filter(id => !id.equals(request.id))
      newRequestType.requests.push(request.id)
      await updateRequestTypeHelper({"id": requestTypeId, "requests": oldRequestType.requests}, dataSources)
      await updateRequestTypeHelper({"id": request.requestType.toString(), "requests": newRequestType.requests}, dataSources)
      request.requestType = Types.ObjectId(request.requestType)
    }
    else {
      await updateRequestTypeHelper({"id": requestTypeId}, dataSources)
    }
    let a = false
    if(a) {
      throw Error()
    }
    await session.commitTransaction()
    session.endSession()
    return res
  }
  catch(err) {
    console.log('Requests')
    console.log(err)
    await session.abortTransaction()
    session.endSession()
    throw err
  }
}

const softDeleteRequestHelper = async (id, dataSources) => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const res = await dataSources.requests.softDelete(id)
    await session.commitTransaction()
    session.endSession()
    return res
  }
  catch(error) {
    console.log(error)
    await session.abortTransaction()
    session.endSession()
  }
}

export { filterDeletedRequests, filterOpenRequests, filterFulfilledRequests, getRequestsById, softDeleteRequestHelper, updateRequestHelper }
