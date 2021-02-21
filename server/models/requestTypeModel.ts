import { Document, model, Schema, Types } from 'mongoose'

interface RequestTypeInterface {
  _id: Types.ObjectId
  name: string
  deleted: boolean
  requests: {
    open: [Types.ObjectId]
    fulfilled: [Types.ObjectId]
    deleted: [Types.ObjectId]
  }
}

type RequestTypeDocument = RequestTypeInterface & Document;

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
        type: [ { type: Types.ObjectId, ref: 'Request' } ]
    },
    fulfilled: {
        type: [ { type: Types.ObjectId, ref: 'Request' } ]
    },
    deleted: {
        type: [ { type: Types.ObjectId, ref: 'Request' } ]
    }
  }
})

const RequestType = model('RequestType', RequestTypeSchema)

export { RequestType, RequestTypeDocument, RequestTypeInterface};
