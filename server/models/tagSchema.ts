import { Document, ObjectId, Schema } from 'mongoose'

interface TagDocument extends Document {
  _id: ObjectId
  type: string
  value: string
}

const TagEnum = [
  'CATEGORY',
  'LOCATION',
  'PRICE_RANGE'
]

const tagSchema = new Schema({
  type: {
    type: String,
    enum: TagEnum,
    required: true
  },
  value: {
    type: Object,
    required: true
  }
})

export { tagSchema, TagEnum, TagDocument }
