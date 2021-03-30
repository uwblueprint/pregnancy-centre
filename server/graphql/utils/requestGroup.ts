import { Document } from 'mongoose'
import { softDeleteRequestTypeHelper } from './requestType'

const updateRequestGroupHelper = (requestGroup, dataSources): Promise<Document> => {
  return dataSources.requestGroups.update(requestGroup)
}

const softDeleteRequestGroupHelper = (id, dataSources) => {
  const requestGroup = dataSources.requestGroups.getById(id)
  requestGroup.requestTypes.map(id => {
    softDeleteRequestTypeHelper(id, dataSources)
  })
  return dataSources.requestGroups.softDelete(id)
}

export { softDeleteRequestGroupHelper, updateRequestGroupHelper }
