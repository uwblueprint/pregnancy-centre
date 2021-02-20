import { RequestInterface } from '../models/requestModel'
import { RequestTypeInterface } from '../models/requestTypeModel'

const resolvers = {
  Query: {
    request: (_, { id }, { dataSources }): RequestInterface => dataSources.requests.getRequestById(id),
    requests: (_, __, { dataSources }): Array<RequestInterface> => dataSources.requests.getRequests(),
    requestType: (_, { id }, { dataSources }): RequestTypeInterface => dataSources.requestTypes.getRequestTypeById(id),
    requestTypes: (_, { id }, { dataSources }): Array<RequestTypeInterface> => dataSources.requestTypes.getRequestTypes()
  }
}

export { resolvers }
