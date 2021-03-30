import { Document, Types } from 'mongoose'
import { updateRequestGroupHelper } from './requestGroup'

import { UserInputError } from 'apollo-server-errors'

const updateRequestTypeHelper = (requestType, dataSources): Promise<Document> => {
  if(!requestType.id) {
    throw new UserInputError('Missing argument value', { argumentName: 'id' })
  }

  const currentRequestTypeCopy = dataSources.requestTypes.getById(requestType.id.toString()).toObject()
  currentRequestTypeCopy.id = currentRequestTypeCopy._id
  const currentRequestType = dataSources.requestTypes.getById(requestType.id.toString())
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
      dataSources.requestGroups.update(oldRequestGroup)
      dataSources.requestGroups.update(newRequestGroup)

      currentRequestType.requestGroup = requestType.requestGroup
    }

    const requestGroupId = currentRequestType.requestGroup.toString()
    return dataSources.requestTypes.update(requestType)
      .then(res => {
        updateRequestGroupHelper({"id": requestGroupId}, dataSources)
        return res
      })
      .catch(error => {
        console.log(error)
        dataSources.requestTypes.update(currentRequestTypeCopy)
        if(requestType.requestGroup) {
          dataSources.requestGroups.update(oldRequestGroupCopy)
          dataSources.requestGroups.update(newRequestGroupCopy)
        }
        throw error
      })
  }
  catch(error) {
      console.log(error)
      dataSources.requestTypes.update(currentRequestTypeCopy)
      if(requestType.requestGroup) {
        dataSources.requestGroups.update(oldRequestGroupCopy)
        dataSources.requestGroups.update(newRequestGroupCopy)
      }
      throw error
  }
}

const softDeleteRequestTypeHelper = (id, dataSources): Promise<Document> => {
  const requestType = dataSources.requestTypes.getById(id)
  requestType.requests.map(id => {dataSources.requests.softDelete(id)})
  return dataSources.requestTypes.softDelete(id)
}

export { softDeleteRequestTypeHelper, updateRequestTypeHelper }
