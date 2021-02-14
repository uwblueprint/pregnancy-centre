import { Document, Schema, Types } from 'mongoose'

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

export { RequestTypeSchema, RequestTypeDocument }
