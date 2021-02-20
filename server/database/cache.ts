import { Document, Model, Query } from 'mongoose'
import { Request } from '../models/requestModel'
import { RequestType } from '../models/requestTypeModel'

class Cache {
  name: string;
  model: Model<Document>;
  query: Query<Array<Document>, Document>;
  data: Array<Document>;

  constructor(name: string, model: Model<Document>, query: Query<Array<Document>, Document>) {
    this.name = name
    this.model = model
    this.query = query
  }

  exec(): void {
    this.query.exec()
      .then((data) => {
        this.data = data
        console.log('Finished caching ' + this.name + ' cache')
      })
      .catch((error) => {
        console.error(`ERROR: Failed to fetch Requests from MongoDB\n${error}`)
      })
  }

  init(): void {
    this.exec()
    this.model.watch().on('change', this.exec)
  }

  getData(): Array<Document> {
    return this.data
  }
}

const RequestsCache = new Cache('Request', Request, Request.find())
const RequestTypesCache = new Cache('RequestType', RequestType, RequestType.find())

export { Cache, RequestsCache, RequestTypesCache }
