import { Document, model, Schema, Types } from 'mongoose'
import { RequestInterface } from './requestModel'

interface RequestTypeInterface {
  _id: Types.ObjectId
  name: string
  deleted: boolean
  requests: {
    open: Array<RequestInterface>
    fulfilled: Array<RequestInterface>
    deleted: Array<RequestInterface>
  }
}

type RequestTypeDocument = RequestTypeInterface & Document

const RequestTypeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  },
  requests: {
    open: {
      type: [{ type: Types.ObjectId, ref: 'Request' }]
    },
    fulfilled: {
      type: [{ type: Types.ObjectId, ref: 'Request' }]
    },
    deleted: {
      type: [{ type: Types.ObjectId, ref: 'Request' }]
    }
  }
})

const RequestType = model('RequestType', RequestTypeSchema)

export { RequestType, RequestTypeDocument, RequestTypeInterface };
