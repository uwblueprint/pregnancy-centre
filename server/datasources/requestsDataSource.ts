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

    return result
  }

  async getAll(): Promise<Array<RequestInterface>> {
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

    return result
  }
}
