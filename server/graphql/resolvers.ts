import { Types } from 'mongoose'
import { RequestGroupInterface } from '../models/requestGroupModel'
import { RequestInterface } from '../models/requestModel'
import { RequestTypeInterface } from '../models/requestTypeModel'

const resolvers = {
  Query: {
    request: (_, { id }, { dataSources }): RequestInterface => dataSources.requests.getById(Types.ObjectId(id)),
    requests: (_, __, { dataSources }): Array<RequestInterface> => dataSources.requests.getAll(),
    requestType: (_, { id }, { dataSources }): RequestTypeInterface => dataSources.requestTypes.getById(Types.ObjectId(id)),
    requestTypes: (_, __, { dataSources }): Array<RequestTypeInterface> => dataSources.requestTypes.getAll(),
    requestGroup: (_, { id }, { dataSources }): RequestGroupInterface => dataSources.requestGroups.getById(Types.ObjectId(id)),
    requestGroups: (_, __, { dataSources }): Array<RequestGroupInterface> => dataSources.requestGroups.getAll()
  },
  RequestGroup: {
    requestTypes: (parent, __, { dataSources }): Array<RequestTypeInterface> => parent.requestTypes.map((id) => {dataSources.requestTypes.getById(Types.ObjectId(id))})
  },
  RequestType: {
    requests: {
      open: (parent, __, { dataSources }): Array<RequestInterface> => parent.requests.open.map((id) => {dataSources.requests.getById(Types.ObjectId(id))}),
      fulfilled: (parent, __, { dataSources }): Array<RequestInterface> => parent.requests.open.map((id) => {dataSources.requests.getById(Types.ObjectId(id))}),
      deleted: (parent, __, { dataSources }): Array<RequestInterface> => parent.requests.open.map((id) => {dataSources.requests.getById(Types.ObjectId(id))})
    }
  }
}

export { resolvers }
