import { DataSource } from 'apollo-datasource'
import dotenv from 'dotenv'
import { Types } from 'mongoose'

import { RequestType, RequestTypeDocument, RequestTypeInterface } from '../models/requestTypeModel'
import RequestDataSource from './requestsDataSource'
import { RequestTypesCache } from '../database/cache'

dotenv.config()
const CACHING = process.env.CACHING == 'TRUE'

export default class RequestTypeDataSource extends DataSource {
  requestDataSource: RequestDataSource

  constructor() {
    super()
    this.requestDataSource = new RequestDataSource
  }

  async getById(id: Types.ObjectId): Promise<RequestTypeInterface> {
    let result

    if (CACHING) {
      result = RequestTypesCache.getData().filter(requestType => requestType._id.equals(id))[0]
    } else {
      await RequestType.findById(id).exec()
        .then((res) => {
          result = res
        })
        .catch((err) => {
          console.error(err)
        })
    }

    return result
  }

  async getAll(): Promise<Array<RequestTypeInterface>> {
    let result

    if (CACHING) {
      result = RequestTypesCache.getData()
    } else {
      await RequestType.find().exec()
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
