import { ClientSession, Document, Types } from 'mongoose'
import { DataSource } from 'apollo-datasource'
import { UserInputError } from 'apollo-server-errors';

import { Cache } from '../database/cache'

export default class CachedMongooseDataSource<DocumentType extends Document> extends DataSource {
  cache: Cache<DocumentType>;

  constructor(cache: Cache<DocumentType>) {
      super()
      this.cache = cache
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

  async create(inputObject: Document, session: ClientSession): Promise<Document> {
    const newObject = new this.cache.model(inputObject)
    const promise = await newObject.save({ session })
    return promise
  }

  async update(inputObject: Document, session: ClientSession): Promise<Document> {
    if(!inputObject.id) {
      throw new UserInputError('Missing argument value', { argumentName: 'id' })
    }
    const promise = await this.cache.model.findByIdAndUpdate(inputObject.id.toString(), inputObject, { session }).orFail()
    return promise
  }
  
  async softDelete(id: Types.ObjectId, session: ClientSession): Promise<Document> {
    const promise = this.cache.model.findByIdAndUpdate(id, {"deleted": true}, { session }).orFail()
    return promise
  }
}
  