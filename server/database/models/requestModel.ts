import { Document, model, Schema, Types } from 'mongoose'

interface RequestInterface extends Document {
  _id: Types.ObjectId

  // Properties
  quantity: number 

  // References
  requestType: Types.ObjectId
  client: Types.ObjectId

  // Timestamps
  createdAt: Date
  updatedAt: Date

  // Timestamps for Statuses
  deletedAt: Date
  fulfilledAt: Date
}

const requestSchema = new Schema({
  // Properties
  quantity: {
    type: Number,
    required: true,
    default: 1
  },

  // References
  requestType: {
    type: Types.ObjectId, ref: 'RequestType'
  },
  client: {
    type: Types.ObjectId, ref: 'Client'
  },

  // Timestamps for Statuses
  deletedAt: {
    type: Date
  },
  fulfilledAt: {
    type: Date
  },

}, // Options
{
  timestamps: true
})

const Request = model<RequestInterface>('Request', requestSchema)

export { Request, RequestInterface }
