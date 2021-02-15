import { Document, model, Schema, Types } from 'mongoose'

interface RequestInterface {
  _id: Types.ObjectId
  request_id: string
  client_id: string
  date_created: Date
  date_fulfilled: Date
  deleted: boolean
  fulfilled: boolean
}

type RequestDocument = RequestInterface & Document;

const requestSchema = new Schema({
  request_id: {
    type: String,
    required: true
  },
  client_id: {
    type: String
  },
  date_created: {
    type: Date,
    required: true,
    default: Date.now
  },
  date_fulfilled: {
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
