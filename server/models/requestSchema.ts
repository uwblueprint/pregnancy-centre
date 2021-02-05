import mongoose = require("mongoose");
const tagSchema = require("tagSchema");
const flagSchema = require("flagSchema");

const requestsSchema = new mongoose.Schema({
  request_id: {
    type: String,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
    default: "",
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String // the URL to the image
  },
  priority: {
    type: Number
  },
  tags: {
    type: [tagSchema]
  },
  flags: {
    type: [flagSchema]
  }
});

module.exports = requestsSchema;
