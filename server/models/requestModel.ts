import { Document, model, Schema, Types } from 'mongoose'

import { TagDocument, tagSchema } from './tagSchema'

interface RequestInterface {
  _id: Types.ObjectId
  archived: boolean
  date_created: Date
  deleted: boolean
  description: string
  fulfilled: boolean
  image: string
  name: string
  priority: number
  request_id: string
  tags: [TagDocument]
}

type RequestDocument = RequestInterface & Document;

const requestSchema = new Schema({
  request_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: Number,
    default: 0
  },
  date_created: {
    type: Date,
    required: true,
    default: Date.now
  },
  archived: {
    type: Boolean,
    required: true,
    default: false
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  },
  fulfilled: {
    type: Boolean,
    required: true,
    default: false
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String // the URL to the image
  },
  tags: {
    type: [tagSchema]
  }
})

const Request = model('Request', requestSchema)

export { Request, RequestDocument, RequestInterface }
