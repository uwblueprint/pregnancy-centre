import { DataSource } from 'apollo-datasource'
import { Types } from 'mongoose'

import { Request, RequestDocument, RequestInterface } from '../models/requestModel'
import { config } from '../config'
import { RequestsCache } from '../cache'

// TODO: rewrite

/*export default class RequestDataSource extends DataSource {
  async getRequestById(rawId: string): Promise<RequestInterface> {
    const id = Types.ObjectId(rawId)
    let result

    if (config.caching) {
      result = RequestsCache.getData().filter(request => request._id.equals(id))[0]
    } else {
      Request.findById(id).exec()
        .then((res) => {
          result = res[0]
        })
        .catch((err) => {
          console.error(err)
        })
    }

    return this.requestReducer(result)
  }

  async getRequests(): Promise<Array<RequestInterface>> {
    let result

    if (config.caching) {
      result = RequestsCache.getData()
    } else {
      Request.find().exec()
        .then((res) => {
          result = res
        })
        .catch((err) => {
          console.error(err)
        })
    }

    return result.map((request) => this.requestReducer(request))
  }

  requestReducer(request: RequestDocument): RequestInterface {
    return {
      _id: request._id,
      archived: request.archived,
      date_created: request.date_created,
      deleted: request.deleted,
      description: request.description,
      fulfilled: request.fulfilled,
      image: request.image,
      name: request.name,
      priority: request.priority,
      request_id: request.request_id,
      tags: request.tags
    }
  }
}*/
