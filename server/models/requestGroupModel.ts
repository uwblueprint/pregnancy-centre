import { Document, model, Schema, Types } from 'mongoose'

interface RequestGroupInterface {
  _id: Types.ObjectId
  name: string
  dateUpdated: Date,
  description: string
  deleted: boolean
  requirements: string
  image: string
  requestTypes: [Types.ObjectId]
}

type RequestGroupDocument = RequestGroupInterface & Document;

const RequestGroupSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
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
  description: {
    type: String
  },
  requirements: {
    type: String
  },
  image: {
    type: String
  },
  requestTypes: {
    type: [ { type: Types.ObjectId, ref: 'RequestType' } ]
  }
})

const RequestGroup = model('RequestGroup', RequestGroupSchema)

export { RequestGroup, RequestGroupDocument, RequestGroupInterface }
