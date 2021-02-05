import mongoose from 'mongoose';

const tagSchema = require("tagSchema");
const flagSchema = require("flagSchema");

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
  },
  flags: {
    type: [flagSchema]
  }
});

const Request = mongoose.model('Request', tagSchema);

export { Request };
