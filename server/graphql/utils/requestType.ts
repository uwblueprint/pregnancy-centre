import { Document, Types } from 'mongoose'
import { softDeleteRequestHelper } from './request'
import { updateRequestGroupHelper } from './requestGroup'

import { UserInputError } from 'apollo-server-errors'

import mongoose from 'mongoose'

const updateRequestTypeHelper = async (requestType, dataSources): Promise<Document> => {
  if(!requestType.id) {
    throw new UserInputError('Missing argument value', { argumentName: 'id' })
  }
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const currentRequestType = dataSources.requestTypes.getById(requestType.id.toString())
    const oldRequestGroupId = currentRequestType.requestGroup.toString()
    const res = await dataSources.requestTypes.update(requestType, session)
    if(requestType.requestGroup) {
      const newRequestGroupId = requestType.requestGroup.toString()
      const oldRequestGroup = dataSources.requestGroups.getById(oldRequestGroupId)
      const newRequestGroup = dataSources.requestGroups.getById(requestType.requestGroup.toString())
      oldRequestGroup.requestTypes = oldRequestGroup.requestTypes.filter(id => !id.equals(requestType.id))
      newRequestGroup.requestTypes.push(requestType.id)
      await updateRequestGroupHelper({"id": oldRequestGroupId, "requestTypes": oldRequestGroup.requestTypes}, dataSources)
      await updateRequestGroupHelper({"id": newRequestGroupId, "requestTypes": newRequestGroup.requestTypes}, dataSources)
      requestType.requestGroup = Types.ObjectId(requestType.requestGroup)
    }
    else {
      await updateRequestGroupHelper({"id": oldRequestGroupId}, dataSources)
    }
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
