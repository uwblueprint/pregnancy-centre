import { Document, model, Schema, Types } from 'mongoose'


// TODO: Add `deleted` field to RequestTypeDocument and graphql schema
interface RequestTypeDocument extends Document {
  _id: Types.ObjectId
  name: string
  requests: {
    open: [Types.ObjectId]
    fulfilled: [Types.ObjectId]
    deleted: [Types.ObjectId]
  }
}

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

export { RequestType, RequestTypeDocument }
