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
    const currentRequestType = dataSources.requestTypes.getById("606369c034278e104cb5fc2b")
    const requestGroupId = currentRequestType.requestGroup.toString()
    const res = await dataSources.requestTypes.update(requestType, session)
    if(requestType.requestGroup) {
      const oldRequestGroup = dataSources.requestGroups.getById(requestGroupId)
      const newRequestGroup = dataSources.requestGroups.getById(requestType.requestGroup.toString())
      oldRequestGroup.requestTypes = oldRequestGroup.requestTypes.filter(id => !id.equals(requestType.id))
      newRequestGroup.requestTypes.push(requestType.id)
      await updateRequestGroupHelper({"id": requestGroupId, "requestTypes": oldRequestGroup.requestTypes}, dataSources)
      await updateRequestGroupHelper({"id": requestType.requestGroup.toString(), "requestTypes": newRequestGroup.requestTypes}, dataSources)
      requestType.requestGroup = Types.ObjectId(requestType.requestGroup)
    }
    else {
      await updateRequestGroupHelper({"id": requestGroupId}, dataSources)
    }
    await session.commitTransaction()
    session.endSession()
    return res
  }
  catch(error) {
    console.log(error)
    await session.abortTransaction()
    session.endSession()
    throw error
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
    session.endSession()
    return res

  }
  catch(error) {
    console.log(error)
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}

export { softDeleteRequestTypeHelper, updateRequestTypeHelper }
