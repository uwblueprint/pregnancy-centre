import { Document, model, ObjectId, Schema } from 'mongoose'
import { StringDecoder } from 'string_decoder'

interface UserDocument extends Document {
  _id: ObjectId
  email: string
  username: string
  passwordSalt: string
  passwordHash: string
  accountType: number
  verified: Boolean
  verificationHash: string
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
  passwordSalt: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  accountType: {
    type: Number
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  verificationHash: {
    type: String
  }
})

const User = model('User', userSchema)

export { User, UserDocument }
