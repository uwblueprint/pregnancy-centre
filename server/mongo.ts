import mongoose = require("mongoose");
const requestSchema = require("/models/requestSchema")

const Requests = mongoose.model('Requests', requestSchema)