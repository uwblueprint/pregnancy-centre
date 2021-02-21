import CachedMongooseDataSource from './cachedMongooseDataSource'
import { RequestDocument } from '../models/requestModel'
import { RequestCache } from '../database/cache'

export default class RequestDataSource extends CachedMongooseDataSource<RequestDocument> {
  constructor() {
    super(RequestCache)
  }
}
