import { RequestGroupInterface } from '../models/requestGroupModel'
import { RequestInterface } from '../models/requestModel'
import { RequestTypeInterface } from '../models/requestTypeModel'

const resolvers = {
  Query: {
    request: (_, { id }, { dataSources }): RequestInterface => dataSources.requests.getRequestById(id),
    requests: (_, __, { dataSources }): Array<RequestInterface> => dataSources.requests.getRequests(),
    requestType: (_, { id }, { dataSources }): RequestTypeInterface => dataSources.requestTypes.getRequestTypeById(id),
    requestTypes: (_, __, { dataSources }): Array<RequestTypeInterface> => dataSources.requestTypes.getRequestTypes(),
    requestGroup: (_, { id }, { dataSources }): RequestGroupInterface => dataSources.requestGroups.getRequestGroupById(id),
    requestGroups: (_, __, { dataSources }): Array<RequestGroupInterface> => dataSources.requestGroups.getRequestGroups()
  }
}

export { resolvers }
