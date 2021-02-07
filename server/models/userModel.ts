import mongoose from 'mongoose';
import { StringDecoder } from 'string_decoder';

interface UserDocument {
  _id: mongoose.ObjectId
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

const userSchema = new mongoose.Schema({
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
});

const User = mongoose.model('User', userSchema);

export { User, UserDocument };
