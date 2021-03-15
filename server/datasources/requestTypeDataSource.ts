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
    const RequestType = this.cache.model
    const newRequestType = new RequestType(requestType)
    const promise = await newRequestType.save()
      .then(res => {
        return {
          "success": true,
          "message": "RequestType successfully created",
          "id": res._id
        }
      })
      .catch(error => {
        console.log(error)
        return {
          "success": false,
          "message": error._message,
          "id": null 
        }
      })
    return promise
  }
  async updateRequestType(requestType: RequestTypeDocument, id: Types.ObjectId): Promise<ServerResponseInterface> {
    const RequestType = this.cache.model
    const promise = await RequestType.findByIdAndUpdate(id, {...requestType, dateUpdated: Date.now()})
      .then(res => {
        return {
          "success": true,
          "message": "RequestType successfully updated",
          "id": id
        }
      })
      .catch(error => {
        console.log(error)
        return {
          "success": false,
          "message": error._message,
          "id": id
        }
      })
    return promise
  }
}
