import CachedMongooseDataSource from './cachedMongooseDataSource'
import { RequestTypeCache } from '../database/cache'
import { RequestTypeDocument } from '../models/requestTypeModel'
import mongoose from 'mongoose'

export default class RequestTypeDataSource extends CachedMongooseDataSource<RequestTypeDocument> {
  constructor() {
    super(RequestTypeCache)
  }

  createEmptyRequestType(name: String) {
    const RequestType = this.cache.model
    const id = mongoose.Types.ObjectId();
    const type = new RequestType({
      _id: id,
      name: name,
      requests: {
        fulfilled: [],
        deleted: [],
        open: []
      }
    })
    type.save().catch(err => {
      console.log(err);
    })

    return {
      "success": true,
      "message": "bob",
      "id": id
    }
  }
}
