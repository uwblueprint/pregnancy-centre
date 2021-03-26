import { ServerResponseInterface } from '../serverResponse'

const updateRequestGroupHelper = (requestGroup, dataSources, dateUpdated = Date.now()): Promise<ServerResponseInterface> => {
  requestGroup.dateUpdated = dateUpdated;
  return dataSources.requestGroups.update(requestGroup)
    .then(res => {
      return res
    })
    .catch(error => {
      return error
    })
}

export { updateRequestGroupHelper }
