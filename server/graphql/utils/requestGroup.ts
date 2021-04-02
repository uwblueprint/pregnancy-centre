import mongoose, { Document } from 'mongoose'
import { softDeleteRequestTypeHelper } from './requestType'

const updateRequestGroupHelper = async (requestGroup, dataSources): Promise<Document> => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
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
    session.startTransaction()
    const requestGroup = dataSources.requestGroups.getById(id)
    const res = await dataSources.requestGroups.softDelete(id, session)
    await requestGroup.requestTypes.map(id => {
      softDeleteRequestTypeHelper(id, dataSources)
    })
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
