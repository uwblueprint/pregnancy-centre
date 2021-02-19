import { RequestInterface } from '../models/requestModel'
import { RequestGroupInterface } from '../models/requestGroupModel'

const resolvers = {
  Query: {
    request: (_, { id }, { dataSources }): RequestInterface => dataSources.requests.getRequestById(id),
    requests: (_, __, { dataSources }): Array<RequestInterface> => dataSources.requests.getRequests(),
    requestGroup: (_, { id }, { dataSources }): RequestGroupInterface => dataSources.requestGroups.getRequestGroupById(id),
    requestGroups: (_, __, { dataSources }): Array<RequestGroupInterface> => dataSources.requestGroups.getRequestGroups()
  }
}

export { resolvers }
