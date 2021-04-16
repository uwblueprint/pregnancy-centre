import mongoose, { Document } from 'mongoose'
import { UserInputError } from 'apollo-server-errors'

import { nextRequestRequestTypeHelper, softDeleteRequestTypeHelper } from './requestType'
import { RequestInterface } from '../../database/models/requestModel'
import { RequestTypeDocument } from '../../database/models/requestTypeModel'

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


const createRequestGroupHelper = async (requestGroup, dataSources, session): Promise<Document> => {
  const newRequestGroup = await dataSources.requestGroups.create(requestGroup, session)

  newRequestGroup.id = newRequestGroup._id
  if (requestGroup.requestTypeNames) {
    const requestTypePromises: Array<Promise<RequestTypeDocument>> = requestGroup.requestTypeNames.map((requestTypeName) => (
      dataSources.requestTypes.create({ name: requestTypeName, requestGroup: newRequestGroup.id }, session)
    ))

    await Promise.all(requestTypePromises).then((requestTypes: Array<RequestTypeDocument>) => {
      newRequestGroup.requestTypes = requestTypes.map((requestType) => requestType._id)
      return dataSources.requestGroups.update(newRequestGroup, session)
    })
  }

  return newRequestGroup
}

const updateRequestGroupHelper = async (requestGroup, dataSources, session): Promise<Document> => {
  if (!requestGroup.id) {
    throw new UserInputError('Missing argument value', { argumentName: 'id' })
  }

  if (requestGroup.requestTypeNames) {
    const oldRequestGroup = await dataSources.requestGroups.getById(requestGroup.id)
    const oldRequestTypes: Array<RequestTypeDocument> = await Promise.all(oldRequestGroup.requestTypes.map((requestTypeId) => dataSources.requestTypes.getById(requestTypeId)))
    const oldRequestTypeNames = new Set(oldRequestTypes.map((requestType) => requestType.name))
    const oldRequestTypeIds = oldRequestTypes.map((requestType) => requestType._id)

    // Request types which are not in oldRequestTypes are new request types
    const newRequestTypeNames = requestGroup.requestTypeNames.filter((requestTypeName) => !oldRequestTypeNames.has(requestTypeName));

    // Request types missing from requestGroup.requestTypeNames are deleted 
    const requestTypeNames = new Set(requestGroup.requestTypeNames)
    const deletedRequestTypeIds = oldRequestTypes
      .filter((requestType) => !requestTypeNames.has(requestType.name))
      .map((requestType) => requestType._id)

    // Create new request types
    const createRequestTypePromises: Array<Promise<RequestTypeDocument>> = newRequestTypeNames.map((requestTypeName) =>
      dataSources.requestTypes.create({ name: requestTypeName, requestGroup: requestGroup.id })
    )
    const newRequestTypeIds = await Promise.all(createRequestTypePromises)
      .then((requestTypes: Array<RequestTypeDocument>) => requestTypes.map(requestType => requestType._id))

    // Soft delete missing request types
    await Promise.all(deletedRequestTypeIds.map((requestTypeId) => softDeleteRequestTypeHelper(requestTypeId, dataSources)))

    // Update request group's requestTypes
    requestGroup.requestTypes = oldRequestTypeIds.concat(newRequestTypeIds)
  }

  const res = await dataSources.requestGroups.update(requestGroup, session)
  return res
}

const softDeleteRequestGroupHelper = async (id, dataSources) => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const requestGroup = dataSources.requestGroups.getById(id)
    const res = await dataSources.requestGroups.softDelete(id, session)
    await requestGroup.requestTypes.map(id => {
      softDeleteRequestTypeHelper(id, dataSources)
    })
    await session.commitTransaction()
    return res
  }
  catch (error) {
    console.log(error)
    await session.abortTransaction()
    throw error
  }
  finally {
    session.endSession()
  }
}

export { createRequestGroupHelper, nextRequestRequestGroupHelper, softDeleteRequestGroupHelper, updateRequestGroupHelper }
