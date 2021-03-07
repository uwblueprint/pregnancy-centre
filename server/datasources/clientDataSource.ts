import CachedMongooseDataSource from './cachedMongooseDataSource'
import { ClientCache } from '../database/cache'
import { ClientDocument } from '../models/clientModel'

export default class ClientDataSource extends CachedMongooseDataSource<ClientDocument> {
  constructor() {
    super(ClientCache)
  }
}
