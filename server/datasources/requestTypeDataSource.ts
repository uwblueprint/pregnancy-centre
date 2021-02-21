import CachedMongooseDataSource from './cachedMongooseDataSource'
import { RequestTypeDocument } from '../models/requestTypeModel'
import { RequestTypeCache } from '../database/cache'

export default class RequestTypeDataSource extends CachedMongooseDataSource<RequestTypeDocument> {
  constructor() {
    super(RequestTypeCache)
  }
}
