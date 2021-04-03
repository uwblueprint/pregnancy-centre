import { Document, Types } from 'mongoose'
import { softDeleteRequestHelper } from './request'
import { updateRequestGroupHelper } from './requestGroup'

import { UserInputError } from 'apollo-server-errors'

import mongoose from 'mongoose'

const updateRequestTypeHelper = async (requestType, dataSources, session): Promise<Document> => {
  if(!requestType.id) {
    throw new UserInputError('Missing argument value', { argumentName: 'id' })
  }
  const currentRequestType = dataSources.requestTypes.getById(requestType.id.toString())
  const oldRequestGroupId = currentRequestType.requestGroup.toString()
  if(requestType.requestGroup) {
    const newRequestGroupId = requestType.requestGroup.toString()
    const oldRequestGroup = dataSources.requestGroups.getById(oldRequestGroupId)
    const newRequestGroup = dataSources.requestGroups.getById(newRequestGroupId)
    oldRequestGroup.requestTypes = oldRequestGroup.requestTypes.filter(id => !id.equals(requestType.id))
    newRequestGroup.requestTypes.push(requestType.id)
    await updateRequestGroupHelper({"id": oldRequestGroupId, "requestTypes": oldRequestGroup.requestTypes}, dataSources, session)
    await updateRequestGroupHelper({"id": newRequestGroupId, "requestTypes": newRequestGroup.requestTypes}, dataSources, session)
    requestType.requestGroup = Types.ObjectId(requestType.requestGroup)
  }
  else {
    await updateRequestGroupHelper({"id": oldRequestGroupId}, dataSources, session)
  }
  const res = await dataSources.requestTypes.update(requestType, session)
  return res
}

const softDeleteRequestTypeHelper = async (id, dataSources): Promise<Document> => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const requestType = dataSources.requestTypes.getById(id)
    const res = await dataSources.requestTypes.softDelete(id, session)
    await requestType.requests.map(id => { softDeleteRequestHelper(id, dataSources) })
    await session.commitTransaction()
    return res

  }
  catch(error) {
    console.log(error)
    await session.abortTransaction()
    throw error
  }
  finally {
    session.endSession()
  }
}

export { softDeleteRequestTypeHelper, updateRequestTypeHelper }
