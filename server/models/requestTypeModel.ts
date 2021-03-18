import { Document, model, Schema, Types } from 'mongoose'
import { RequestInterface } from './requestModel'

interface RequestTypeInterface {
  _id: Types.ObjectId
  name: string
  dateUpdated: Date,
  deleted: boolean,
  requests: Array<RequestInterface>
}

type RequestTypeDocument = RequestTypeInterface & Document

const RequestTypeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  dateUpdated: {
    type: Date,
    required: true,
    default: Date.now()
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  },
  requests: {
    type: [{ type: Types.ObjectId, ref: 'Request' }],
    default: []
  }
})

const RequestType = model('RequestType', RequestTypeSchema)

export { RequestType, RequestTypeDocument, RequestTypeInterface };
