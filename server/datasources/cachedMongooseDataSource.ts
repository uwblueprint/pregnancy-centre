import { Document, Types } from 'mongoose'
import { Cache } from '../database/cache'
import { DataSource } from 'apollo-datasource'

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
}
  