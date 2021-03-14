import CachedMongooseDataSource from './cachedMongooseDataSource'
import { RequestTypeCache } from '../database/cache'
import { RequestTypeDocument } from '../models/requestTypeModel'
import { ServerResponseInterface } from '../models/serverResponseModel'

import { Types } from 'mongoose'

export default class RequestTypeDataSource extends CachedMongooseDataSource<RequestTypeDocument> {
  constructor() {
    super(RequestTypeCache)
  }
  async softDeleteRequestType(id: Types.ObjectId) {
    const RequestType = this.cache.model
    try {
      const promise = RequestType.findByIdAndUpdate(id, {"deleted": true})
        .then(res => {
          return {
            "success": true,
            "message": "RequestType successfully deleted",
            "id": id
          }
        })
      return promise
    }
    catch(error) {
      console.log(error)
      return {
        "success": false,
        "message": error._message,
        "id": id
      }
    }
  }
  async createOrUpdateRequestType(newRequestType: RequestTypeDocument, id: Types.ObjectId): Promise<ServerResponseInterface> {
    const RequestType = this.cache.model
    if(id) {
      try {
        const promise = await RequestType.findByIdAndUpdate(id, newRequestType, {upsert: true})
          .then(res => {
            return {
              "success": true,
              "message": "RequestType successfully updated",
              "id": id
            }
          })
        return promise
      }
      catch(error) {
        console.log(error)
        return {
          "success": false,
          "message": error._message,
          "id": id
        }
      }
    }
    else {
      const requestType = new RequestType(newRequestType)
      try {
        const promise = await requestType.save()
          .then(res => {
            return {
              "success": true,
              "message": "RequestType successfully created",
              "id": res._id
            }
          })
        return promise
      }
      catch(error) {
        console.log(error)
        return {
          "success": false,
          "message": error._message,
          "id": id
        }
      }
    }
  }
}
