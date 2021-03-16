import { Document, Types } from 'mongoose'
import { Cache } from '../database/cache'
import { DataSource } from 'apollo-datasource'
import { ServerResponseInterface } from '../graphql/serverResponse';
import { UserInputError } from 'apollo-server-errors';

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

  async create(inputObject: Document): Promise<ServerResponseInterface> {
    const newObject = new this.cache.model(inputObject)
    const promise = await newObject.save()
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

  async update(inputObject: Document): Promise<ServerResponseInterface> {
    if(!inputObject.id) {
      throw new UserInputError('Missing argument value', { argumentName: 'id' })
    }
    const promise = await this.cache.model.findByIdAndUpdate(inputObject.id, {...inputObject, dateUpdated: Date.now()})
      .then(res => {
        return {
          "success": true,
          "message": this.cache.name + " successfully updated",
          "id": inputObject.id
        }
      })
      .catch(error => {
        console.log(error)
        return {
          "success": false,
          "message": error._message,
          "id": inputObject.id
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
  