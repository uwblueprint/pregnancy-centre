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

  throwOnMissingObjectId(id: Types.ObjectId) {
    const res = this.cache.getData().filter(request => request._id && request._id.equals(id))
    if(res.length === 0) {
      throw new Error(`Mongoose ${this.cache.name} ObjectId not found`)
    }
  }
  getById(id: Types.ObjectId): DocumentType {
    const res = this.cache.getData().filter(request => request._id && request._id.equals(id))
    if(res.length === 0) {
      throw new Error(`Mongoose ${this.cache.name} ObjectId not found`)
    }
    return res[0]
  }

  getAll(): Array<DocumentType> {
    return this.cache.getData()
  }

  async create(inputObject: Document): Promise<Document> {
    const newObject = new this.cache.model(inputObject)
    const promise = await newObject.save()
    return promise
  }

  async update(inputObject: Document): Promise<Document> {
    if(!inputObject.id) {
      throw new UserInputError('Missing argument value', { argumentName: 'id' })
    }
    this.throwOnMissingObjectId(inputObject.id) // if id doesn't exist this will throw
    const promise = await this.cache.model.findByIdAndUpdate(inputObject.id.toString(), inputObject)
    return promise
  }
  
  async softDelete(id: Types.ObjectId): Promise<Document> {
    this.throwOnMissingObjectId(id) // throws if id doesn't exist
    const promise = this.cache.model.findByIdAndUpdate(id, {"deleted": true})
    return promise
  }
}
  