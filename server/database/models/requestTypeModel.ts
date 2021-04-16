import { Document, model, Schema, Types } from 'mongoose'

interface RequestTypeInterface extends Document {
  _id: Types.ObjectId

  // Properties
  name: string

  // Precomputed Properties
  numOpen: number

  // References
  requestGroup: Types.ObjectId

  // Embedded Objects
  requests: [ {
    id: Types.ObjectId 
  } ]

  // Timestamps
  createdAt: Date
  updatedAt: Date

  // Timestamps for Statuses
  deletedAt: Date
}

const RequestTypeSchema = new Schema({
  // Properties
  name: {
    type: String,
    required: true
  },

  // Precomputed Properties
  numOpen: {
    type: Number,
    required: true,
    default: 0
  },

  // References
  requestGroup: {
    type: Types.ObjectId, ref: 'RequestGroup'
  },

  // Embedded Objects
  requestTypes: {
    type: [ { 
      id: { type: Types.ObjectId, ref: 'Request' } 
    } ],
    default: []
  },

  // Timestamps for Statuses
  deletedAt: {
    type: Date
  },

}, // Options
{
  timestamps: true
})

const RequestType = model<RequestTypeInterface>('RequestType', RequestTypeSchema)

export { RequestType, RequestTypeInterface };
