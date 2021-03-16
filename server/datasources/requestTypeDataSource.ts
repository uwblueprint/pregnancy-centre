import CachedMongooseDataSource from './cachedMongooseDataSource'
import { RequestTypeCache } from '../database/cache'
import { RequestTypeDocument } from '../models/requestTypeModel'
import { ServerResponseInterface } from '../graphql/serverResponse'

import { Types } from 'mongoose'

export default class RequestTypeDataSource extends CachedMongooseDataSource<RequestTypeDocument> {
  constructor() {
    super(RequestTypeCache)
  }
  
  async createRequestType(requestType: RequestTypeDocument): Promise<ServerResponseInterface> {
    return await super.create(requestType)
      .then(res => {
        return res
      })
      .catch(error => {
        console.log(error)
        return error
      });
  }
  async updateRequestType(requestType: RequestTypeDocument): Promise<ServerResponseInterface> {
    return await super.update(requestType)
      .then(res => {
        return res
      })
      .catch(error => {
        console.log(error)
        return error
      });
  }

  async softDeleteRequest(id: Types.ObjectId): Promise<ServerResponseInterface> {
    return await super.softDelete(id)
      .then(res => {
        return res
      })
      .catch(error => {
        console.log(error)
        return error
      });
  }
}
