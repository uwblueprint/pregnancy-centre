import CachedMongooseDataSource from './cachedMongooseDataSource'
import { RequestGroupDocument } from '../models/requestGroupModel'
import { RequestGroupCache } from '../database/cache'

export default class RequestGroupDataSource extends CachedMongooseDataSource<RequestGroupDocument> {
  constructor() {
    super(RequestGroupCache)
  }
}
