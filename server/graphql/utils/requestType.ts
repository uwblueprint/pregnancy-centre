import { Document, Types } from 'mongoose'
import { updateRequestGroupHelper } from './requestGroup'

import { UserInputError } from 'apollo-server-errors'

const revertUpdates = (requestType, dataSources, currentRequestTypeCopy, oldRequestGroupCopy, newRequestGroupCopy) => {
  dataSources.requestTypes.update(currentRequestTypeCopy)
  if(requestType.requestGroup) {
    dataSources.requestGroups.update(oldRequestGroupCopy)
    dataSources.requestGroups.update(newRequestGroupCopy)
  }
}

const updateRequestTypeHelper = async (requestType, dataSources): Promise<Document> => {
  if(!requestType.id) {
    throw new UserInputError('Missing argument value', { argumentName: 'id' })
  }

  const currentRequestType = dataSources.requestTypes.getById(requestType.id.toString())
  const currentRequestTypeCopy = currentRequestType.toObject()
  currentRequestTypeCopy.id = currentRequestTypeCopy._id
  let oldRequestGroupCopy, newRequestGroupCopy

  if(requestType.requestGroup) {
    // If these fail then nothing has been changed at this point, so nothing to revert
    oldRequestGroupCopy = dataSources.requestGroups.getById(currentRequestType.requestGroup.toString()).toObject()
    oldRequestGroupCopy.id = oldRequestGroupCopy._id
    newRequestGroupCopy = dataSources.requestGroups.getById(requestType.requestGroup.toString()).toObject()
    newRequestGroupCopy.id = newRequestGroupCopy._id
  }

  try {
    if(requestType.requestGroup) {
      const oldRequestGroup = dataSources.requestGroups.getById(currentRequestType.requestGroup.toString())
      const newRequestGroup = dataSources.requestGroups.getById(requestType.requestGroup.toString())
      oldRequestGroup.requestTypes = oldRequestGroup.requestTypes.filter(id => !id.equals(requestType.id))
      newRequestGroup.requestTypes.push(requestType.id)
      await dataSources.requestGroups.update(oldRequestGroup)
      await dataSources.requestGroups.update(newRequestGroup)

      currentRequestType.requestGroup = requestType.requestGroup
      requestType.requestGroup = Types.ObjectId(requestType.requestGroup)
    }

    const requestGroupId = currentRequestType.requestGroup.toString()
    return dataSources.requestTypes.update(requestType)
      .then(res => {
        updateRequestGroupHelper({"id": requestGroupId}, dataSources)
        return res
      })
      .catch(error => {
        console.log(error)
        revertUpdates(requestType, dataSources, currentRequestTypeCopy, oldRequestGroupCopy, newRequestGroupCopy)
        throw error
      })
  }
  catch(error) {
      console.log(error)
      revertUpdates(requestType, dataSources, currentRequestTypeCopy, oldRequestGroupCopy, newRequestGroupCopy)
      throw error
  }
}

const softDeleteRequestTypeHelper = (id, dataSources): Promise<Document> => {
  const requestType = dataSources.requestTypes.getById(id)
  requestType.requests.map(id => {dataSources.requests.softDelete(id)})
  return dataSources.requestTypes.softDelete(id)
}

export { softDeleteRequestTypeHelper, updateRequestTypeHelper }
