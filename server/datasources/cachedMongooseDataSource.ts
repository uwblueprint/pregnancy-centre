import { Document, Types } from 'mongoose'
import { Cache } from '../database/cache'
import { DataSource } from 'apollo-datasource'

export default class CachedMongooseDataSource<DocumentType extends Document> extends DataSource {
  cache: Cache<DocumentType>;

  constructor(cache: Cache<DocumentType>) {
      super()
      this.cache = cache
  }

  getById(id: Types.ObjectId): DocumentType {
    return this.cache.getData().filter(request => request._id.equals(id))[0]
  }

  getAll(): Array<DocumentType> {
    return this.cache.getData()
  }
}
  