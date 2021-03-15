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
    const Request = this.cache.model
    const newRequest = new Request(request)
    const promise = await newRequest.save()
      .then(res => {
        return {
          "success": true,
          "message": "Request successfully created",
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
  async updateRequest(request: RequestDocument, id: Types.ObjectId): Promise<ServerResponseInterface> {
    const Request = this.cache.model
    const promise = await Request.findByIdAndUpdate(id, {...request, dateUpdated: Date.now()})
      .then(res => {
        return {
          "success": true,
          "message": "Request successfully updated",
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
  async softDeleteRequest(id: Types.ObjectId) {
    const Request = this.cache.model
    const promise = Request.findByIdAndUpdate(id, {"deleted": true})
      .then(res => {
        return {
          "success": true,
          "message": "Request successfully soft deleted",
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
