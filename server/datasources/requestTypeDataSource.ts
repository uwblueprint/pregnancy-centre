import CachedMongooseDataSource from './cachedMongooseDataSource'
import { RequestTypeCache } from '../database/cache'
import { RequestTypeDocument } from '../models/requestTypeModel'
import { ServerResponseInterface } from '../graphql/serverResponse'

import { Types } from 'mongoose'

export default class RequestTypeDataSource extends CachedMongooseDataSource<RequestTypeDocument> {
  constructor() {
    super(RequestTypeCache)
  }
  
  async createOrUpdateRequestType(requestType: RequestTypeDocument, id: Types.ObjectId): Promise<ServerResponseInterface> {
    const RequestType = this.cache.model
    if(id) {
      const promise = await RequestType.findByIdAndUpdate(id, {...requestType, dateUpdated: Date.now()}, {upsert: true})
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
            "id": id
          }
        })
      return promise
    }
  }
}
