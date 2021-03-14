import CachedMongooseDataSource from './cachedMongooseDataSource'
import { RequestTypeCache } from '../database/cache'
import { RequestTypeDocument } from '../models/requestTypeModel'
import { ServerResponseInterface } from '../models/serverResponseModel'

import mongoose from 'mongoose'

export default class RequestTypeDataSource extends CachedMongooseDataSource<RequestTypeDocument> {
  constructor() {
    super(RequestTypeCache)
  }

  async createRequestType(name: String, open: Array<String>, fulfilled: Array<String>, deleted: Array<String>): Promise<ServerResponseInterface> {
    const RequestType = this.cache.model
    const id = mongoose.Types.ObjectId();
    const type = new RequestType({
      _id: id,
      name: name,
      requests: {
        fulfilled: fulfilled,
        deleted: deleted,
        open: open
      }
    })
    try {
      const requestType = await type.save().then(res => {
        const response = {
          "success": true,
          "message": "RequestType sucessfully created",
          "id": id 
        }
        return response
      })
      return requestType
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
