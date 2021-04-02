import mongoose, { Document } from 'mongoose'
import { softDeleteRequestTypeHelper } from './requestType'

const updateRequestGroupHelper = async (requestGroup, dataSources): Promise<Document> => {
  const session = await mongoose.startSession()
  try {
    await session.startTransaction()
    const res = await dataSources.requestGroups.update(requestGroup, session)
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

const softDeleteRequestGroupHelper = async (id, dataSources) => {
  const session = await mongoose.startSession()
  try {
    await session.startTransaction()
    const requestGroup = dataSources.requestGroups.getById(id)
    await requestGroup.requestTypes.map(id => {
      softDeleteRequestTypeHelper(id, dataSources)
    })
    const res = await dataSources.requestGroups.softDelete(id)
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

export { softDeleteRequestGroupHelper, updateRequestGroupHelper }
