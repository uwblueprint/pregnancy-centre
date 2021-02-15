import { Document, model, Schema, Types } from 'mongoose'

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
