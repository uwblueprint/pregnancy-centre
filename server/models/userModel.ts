import { StringDecoder } from 'string_decoder'
import { Document, model, ObjectId, Schema } from 'mongoose'


interface UserDocument extends Document {
  _id: ObjectId
  request_id: string
  name: string
  priority: number
  date_created: Date
  archived: boolean
  deleted: boolean
  fulfilled: boolean
  description: string
  image: StringDecoder
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password_salt: {
    type: String,
    required: true
  },
  password_hash: {
    type: String,
    required: true
  },
  account_type: {
    type: Number
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  verification_hash: {
    type: String
  }
})

const User = model('User', userSchema)

export { User, UserDocument }
