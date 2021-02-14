import { Document, model, Schema, Types } from 'mongoose'

import { RequestTypeDocument, RequestTypeSchema } from './requestTypeSchema'

interface RequestGroupInterface {
  _id: Types.ObjectId
  name: string
  description: string
  requirements: string
  image: string
  requestTypes: [RequestGroupDocument]
}

type RequestGroupDocument = RequestGroupInterface & Document;

const RequestGroupSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
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
    type: [RequestTypeSchema],
    required: true,
    default: undefined
  }
})

const RequestGroup = model('RequestGroup', RequestGroupSchema)

export { RequestGroup, RequestGroupDocument, RequestGroupInterface }
