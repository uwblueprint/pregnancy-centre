import { ServerResponseInterface } from '../serverResponse'

const updateRequestGroupHelper = (requestGroup, dataSources): Promise<ServerResponseInterface> => {
  return dataSources.requestGroups.update(requestGroup)
    .then(res => {
      return res
    })
    .catch(error => {
      return error
    })
}

export { updateRequestGroupHelper }
