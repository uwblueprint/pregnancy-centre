import mongoose, { Document } from 'mongoose'

import { nextRequestRequestTypeHelper, softDeleteRequestTypeHelper } from './requestType'
import { RequestInterface } from '../../models/requestModel'

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


const updateRequestGroupHelper = async (requestGroup, dataSources, session): Promise<Document> => {
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
  catch(error) {
    console.log(error)
    await session.abortTransaction()
    throw error
  }
  finally {
    session.endSession()
  }
}

export { nextRequestRequestGroupHelper, softDeleteRequestGroupHelper, updateRequestGroupHelper }
