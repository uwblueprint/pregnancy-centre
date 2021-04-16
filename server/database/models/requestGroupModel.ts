import { Document, model, Schema, Types } from 'mongoose'

interface RequestGroupInterface {
  _id: Types.ObjectId

  // Properties
  name: string
  description: string
  image: string
  
  // Embedded Objects
  requestTypes: [ { 
    id: Types.ObjectId 
  } ]

  // Timestamps for Statuses
  deletedAt: Date

  // Timestamps
  createdAt: Date
  updatedAt: Date
}

type RequestGroupDocument = RequestGroupInterface & Document;

const RequestGroupSchema = new Schema({
  // Properties
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    default: ""
  },
  image: {
    type: String,
    required: true,
    default: ""
  },

  // Embedded Objects
  requestTypes: {
    type: [ { 
      id: { type: Types.ObjectId, ref: 'RequestType' } 
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

const RequestGroup = model('RequestGroup', RequestGroupSchema)

export { RequestGroup, RequestGroupDocument, RequestGroupInterface }
