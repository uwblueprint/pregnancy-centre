import CachedMongooseDataSource from './cachedMongooseDataSource'
import { RequestCache } from '../database/cache'
import { RequestDocument } from '../models/requestModel'
import { ServerResponseInterface } from '../graphql/serverResponse'

import { Types } from 'mongoose'

export default class RequestDataSource extends CachedMongooseDataSource<RequestDocument> {
  constructor() {
    super(RequestCache)
  }
  
  async createRequest(request: RequestDocument): Promise<ServerResponseInterface> {
    return await super.create(request)
      .then(res => {
        return res
      })
      .catch(error => {
        console.log(error)
        return error
      });
  }
  
  async updateRequest(request: RequestDocument): Promise<ServerResponseInterface> {
    return await super.update(request)
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
