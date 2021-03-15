import CachedMongooseDataSource from './cachedMongooseDataSource'
import { RequestTypeCache } from '../database/cache'
import { RequestTypeDocument } from '../models/requestTypeModel'
import { ServerResponseInterface } from '../graphql/serverResponse'

import { Types } from 'mongoose'

export default class RequestTypeDataSource extends CachedMongooseDataSource<RequestTypeDocument> {
  constructor() {
    super(RequestTypeCache)
  }
  
  async createOrUpdateRequestType(newRequestType: RequestTypeDocument, id: Types.ObjectId): Promise<ServerResponseInterface> {
    const RequestType = this.cache.model
    if(id) {
      const promise = await RequestType.findByIdAndUpdate(id, {...newRequestType, dateUpdated: Date.now()}, {upsert: true})
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
    else {
      const requestType = new RequestType(newRequestType)
      const promise = await requestType.save()
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
            "id": id
          }
        })
      return promise
    }
  }
}
