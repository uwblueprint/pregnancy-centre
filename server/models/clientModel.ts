import { Document, model, Schema, Types } from 'mongoose'

interface ClientInterface {
  _id: Types.ObjectId
  clientId: string
  fullName: string
  deleted: boolean
}

type ClientDocument = ClientInterface & Document;

const ClientSchema = new Schema({
  clientId: {
      type: String,
      required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  }
})

const Client = model('Client', ClientSchema)

export { Client, ClientDocument, ClientInterface }
