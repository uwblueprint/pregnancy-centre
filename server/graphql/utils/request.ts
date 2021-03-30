import { RequestInterface } from '../../models/requestModel'
import { ServerResponseInterface } from '../serverResponse'
import { UserInputError } from 'apollo-server-errors'

import { updateRequestTypeHelper } from './requestType'

const filterOpenRequests = (requests: Array<RequestInterface> ) => {
  return requests.filter(request => request.fulfilled === false && request.deleted === false)
}

const filterFulfilledRequests = (requests: Array<RequestInterface> ) => {
  return requests.filter(request => request.fulfilled === true && request.deleted === false)
}

const filterDeletedRequests = (requests: Array<RequestInterface> ) => {
  return requests.filter(request => request.deleted === true)
}

const getRequestsById = (requestIds, dataSources) => {
  console.log("--- STARTING PROCESSING NESTED REQUESTS ---")
  const ret = requestIds.map(id => {
    console.log("GETTING NESTED REQUEST")
    return dataSources.requests.getById(id)})
  console.log("--- FINISHED PROCESSING NESTED REQUESTS ---")
  return ret
}

const updateRequestHelper = (request, dataSources): Promise<ServerResponseInterface> => {
  if(!request.id) {
    throw new UserInputError('Missing argument value', { argumentName: 'id' })
  }
  const requestTypeId = dataSources.requests.getById(request.id.toString()).requestType
  return dataSources.requests.update(request)
    .then(res => {
      updateRequestTypeHelper({"id": requestTypeId}, dataSources)
      return res
    })
    .catch(error => {
      return error
    })
}

export { filterDeletedRequests, filterOpenRequests, filterFulfilledRequests, getRequestsById, updateRequestHelper }
