import { DataSource } from 'apollo-datasource'
import dotenv from 'dotenv'
import { Types } from 'mongoose'

import { Request, RequestDocument, RequestInterface } from '../models/requestModel'
import { RequestsCache } from '../database/cache'

dotenv.config()
const CACHING = process.env.CACHING == 'TRUE'

export default class RequestDataSource extends DataSource {
  async getById(id: Types.ObjectId): Promise<RequestInterface> {
    let result

    if (CACHING) {
      result = RequestsCache.getData().filter(request => request._id.equals(id))[0]
    } else {
      await Request.findById(id).exec()
        .then((res) => {
          result = res
        })
        .catch((err) => {
          console.error(err)
        })
    }

    return this.requestReducer(result)
  }

  async getRequests(): Promise<Array<RequestInterface>> {
    let result

    if (CACHING) {
      result = RequestsCache.getData()
    } else {
      await Request.find().exec()
        .then((res) => {
          result = res
        })
        .catch((err) => {
          console.error(err)
        })
    }

    return result.map((request) => this.requestReducer(request))
  }

  async getRequestsBatchByObjectId(ids: Array<Types.ObjectId>): Promise<Array<RequestInterface>> {
    return Promise.all(ids.map(async (id: Types.ObjectId): Promise<RequestInterface> => (this.getById(id))))
  }

  requestReducer(request: RequestDocument): RequestInterface {
    return {
      _id: request._id,
      request_id: request.request_id,
      client_id: request.client_id,
      date_created: request.date_created,
      date_fulfilled: request.date_fulfilled,
      deleted: request.deleted,
      fulfilled: request.fulfilled,
    }
  }
}
