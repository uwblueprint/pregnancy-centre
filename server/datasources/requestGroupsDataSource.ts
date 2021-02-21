import { DataSource } from 'apollo-datasource'
import dotenv from 'dotenv'
import { Types } from 'mongoose'

import { RequestGroup, RequestGroupDocument, RequestGroupInterface } from '../models/requestGroupModel'
import { RequestGroupsCache } from '../database/cache'

dotenv.config()
const CACHING = process.env.CACHING == 'TRUE'

// TODO(meganniu): make factory class where generic is the mongoose model. factory class should implement getById and getAll
// TODO(meganniu): stadardize plurality of variable/class names (request vs requests, requestGroup vs requestGroups)

export default class RequestGroupDataSource extends DataSource {
  async getById(id: Types.ObjectId): Promise<RequestGroupInterface> {
    let result

    if (CACHING) {
      result = RequestGroupsCache.getData().filter(requestGroup => requestGroup._id.equals(id))[0]
    } else {
      await RequestGroup.findById(id).exec()
        .then((res) => {
          result = res
        })
        .catch((err) => {
          console.error(err)
        })
    }

    return this.requestGroupReducer(result)
  }

  async getAll(): Promise<Array<RequestGroupInterface>> {
    let result

    if (CACHING) {
      result = RequestGroupsCache.getData()
    } else {
      await RequestGroup.find().exec()
        .then((res) => {
          result = res
        })
        .catch((err) => {
          console.error(err)
        })
    }

    return result.map((requestGroup) => this.requestGroupReducer(requestGroup))
  }

  requestGroupReducer(requestGroup: RequestGroupDocument): RequestGroupInterface {
    return {
      _id: requestGroup._id,
      name: requestGroup.name,
      description: requestGroup.description,
      deleted: requestGroup.deleted,
      requirements: requestGroup.requirements,
      image: requestGroup.image,
      requestTypes: requestGroup.requestTypes,
    }
  }
}
