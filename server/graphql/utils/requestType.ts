import { ServerResponseInterface } from '../serverResponse'
import { updateRequestGroupHelper } from './requestGroup'

import { UserInputError } from 'apollo-server-errors'

const updateRequestTypeHelper = (requestType, dataSources, dateUpdated = Date.now()): Promise<ServerResponseInterface> => {
  if(!requestType.id) {
    throw new UserInputError('Missing argument value', { argumentName: 'id' })
  }
  const requestGroupId = dataSources.requestTypes.getById(requestType.id.toString()).requestGroup
  requestType.dateUpdated = dateUpdated
  return dataSources.requestTypes.update(requestType)
    .then(res => {
      updateRequestGroupHelper({"id": requestGroupId}, dataSources, requestType.dateUpdated)
      return res
    })
    .catch(error => {
      return error
    })
}

const softDeleteRequestTypeHelper = (id, dataSources): Promise<ServerResponseInterface> => {
  const requestType = dataSources.requestTypes.getById(id)
  requestType.requests.map(id => {dataSources.requests.softDelete(id)})
  return dataSources.requestTypes.softDelete(id)
}

export { softDeleteRequestTypeHelper, updateRequestTypeHelper }
