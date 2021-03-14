import { Client, ClientDocument } from '../models/clientModel'
import { Document, Model, Query } from 'mongoose'
import { Request, RequestDocument } from '../models/requestModel'
import { RequestGroup, RequestGroupDocument } from '../models/requestGroupModel'
import { RequestType, RequestTypeDocument } from '../models/requestTypeModel'

class Cache<DocumentType extends Document> {
  name: string;
  model: Model<Document>;
  query: Query<Array<Document>, Document>;
  bob: Query<Array<Document>, Document>;
  data: Array<DocumentType>;

  constructor(name: string, model: Model<Document>, query: Query<Array<Document>, Document>) {
    this.name = name
    this.model = model
    this.query = query
    this.bob = query
  }

  exec(): void {
    this.query.exec()
      .then((data: Array<Document>) => {
        this.data = data as Array<DocumentType>
        console.log('Finished caching ' + this.name + ' cache')
      })
      .catch((error) => {
        console.error(`ERROR: Failed to fetch Requests from MongoDB\n${error}`)
      })
    
  }

  init(): void {
    console.log('Initializing ' + this.name + ' cache')
    this.exec()
    this.model.watch().on('change', () => {
      this.exec()})
  }

  getData(): Array<DocumentType> {
    return this.data
  }
}

const ClientCache = new Cache<ClientDocument>('Client', Client, Client.find())
const RequestCache = new Cache<RequestDocument>('Request', Request, Request.find())
const RequestTypeCache = new Cache<RequestTypeDocument>('RequestType', RequestType, RequestType.find())
const RequestGroupCache = new Cache<RequestGroupDocument>('RequestGroup', RequestGroup, RequestGroup.find())

export { Cache, ClientCache, RequestCache, RequestGroupCache, RequestTypeCache }

