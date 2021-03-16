import { Document, Types } from 'mongoose'
import { Cache } from '../database/cache'
import { DataSource } from 'apollo-datasource'
import { ServerResponseInterface } from '../graphql/serverResponse';

export default class CachedMongooseDataSource<DocumentType extends Document> extends DataSource {
  cache: Cache<DocumentType>;

  constructor(cache: Cache<DocumentType>) {
      super()
      this.cache = cache
  }

  async softDeleteRequestType(id: Types.ObjectId) {
    const RequestType = this.cache.model
    const promise = RequestType.findByIdAndUpdate(id, {"deleted": true})
      .then(res => {
        return {
          "success": true,
          "message": "RequestType successfully deleted",
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

  getById(id: Types.ObjectId): DocumentType {
    return this.cache.getData().filter(request => request._id.equals(id))[0]
  }

  getAll(): Array<DocumentType> {
    return this.cache.getData()
  }

  async create(request: Document): Promise<ServerResponseInterface> {
    const Request = this.cache.model
    const newRequest = new Request(request)
    const promise = await newRequest.save()
      .then(res => {
        return {
          "success": true,
          "message": this.cache.name + " successfully created",
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

  async update(request: Document): Promise<ServerResponseInterface> {
    const Request = this.cache.model
    const promise = await Request.findByIdAndUpdate(request._id, {...request, dateUpdated: Date.now()})
      .then(res => {
        return {
          "success": true,
          "message": this.cache.name + " successfully updated",
          "id": request._id
        }
      })
      .catch(error => {
        console.log(error)
        return {
          "success": false,
          "message": error._message,
          "id": request._id
        }
      })
    return promise
  }
  
  async softDelete(id: Types.ObjectId) {
    const Request = this.cache.model
    const promise = Request.findByIdAndUpdate(id, {"deleted": true})
      .then(res => {
        return {
          "success": true,
          "message": this.cache.name + " successfully soft deleted",
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
  