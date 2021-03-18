import { Document, model, Schema, Types } from 'mongoose'

interface RequestInterface {
  _id: Types.ObjectId
  requestType: Types.ObjectId
  requestId: string
  client: Types.ObjectId
  dateUpdated: Date
  dateCreated: Date
  dateFulfilled: Date
  deleted: boolean
  fulfilled: boolean
}

type RequestDocument = RequestInterface & Document;

const requestSchema = new Schema({
  requestType: {
    type:  { type: Types.ObjectId, ref: 'RequestType' }
  },
  requestId: {
    type: String,
    required: true
  },
  client: {
    type: Types.ObjectId, ref: 'Client'
  },
  dateUpdated: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateFulfilled: {
    type: Date,
    required: false,
    default: undefined
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  },
  fulfilled: {
    type: Boolean,
    required: true,
    default: false
  }
})

const Request = model('Request', requestSchema)

export { Request, RequestDocument, RequestInterface }
