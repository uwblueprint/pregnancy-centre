import { RequestInterface } from '../models/requestModel'

const resolvers = {
  Query: {
    request: (_, { id }, { dataSources }): RequestInterface => dataSources.requests.getRequestById(id),
    requests: (_, __, { dataSources }): Array<RequestInterface> => dataSources.requests.getRequests()
  }
}

export { resolvers }
