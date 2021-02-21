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

  async getRequestTypeById(rawId: string): Promise<RequestTypeInterface> {
    const id = Types.ObjectId(rawId)
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

    return this.requestTypeReducer(result)
  }

  async getRequestTypes(): Promise<Array<RequestTypeInterface>> {
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

    return Promise.all(result.map((requestType) => this.requestTypeReducer(requestType)))
  }

  async requestTypeReducer(requestType: RequestTypeDocument): Promise<RequestTypeInterface> {

    return {
      _id: requestType._id,
      name: requestType.name,
      deleted: requestType.deleted,
      requests: {
        open: await this.requestDataSource.getRequestsBatchByObjectId(requestType.requests.open),
        fulfilled: await this.requestDataSource.getRequestsBatchByObjectId(requestType.requests.fulfilled),
        deleted: await this.requestDataSource.getRequestsBatchByObjectId(requestType.requests.deleted)
      }
    }
  }
}
