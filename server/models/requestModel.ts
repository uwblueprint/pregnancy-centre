import mongoose from 'mongoose';

import { tagSchema, TagDocument } from "./tagSchema";

interface RequestDocument {
  _id: mongoose.Types.ObjectId
  request_id: string
  name: string
  priority: number
  date_created: Date
  archived: Boolean
  deleted: Boolean
  fulfilled: Boolean
  description: string
  image: string
  tags: [TagDocument]
}

const requestSchema = new mongoose.Schema({
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
    default: "",
  },
  image: {
    type: String // the URL to the image
  },
  tags: {
    type: [tagSchema]
  }
});

const Request = mongoose.model('Request', requestSchema);

export { Request, RequestDocument };
