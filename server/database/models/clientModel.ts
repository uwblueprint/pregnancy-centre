import { Document, model, Schema, Types } from 'mongoose'

interface ClientInterface {
  _id: Types.ObjectId

  // Properties
  fullName: string

  // Status
  deleted: boolean

  // Timestamps
  createdAt: Date
  updatedAt: Date
}

type ClientDocument = ClientInterface & Document;

const ClientSchema = new Schema({
  // Properties
  fullName: {
    type: String,
    required: true,
    trim: true
  },

  // Status
  deleted: {
    type: Boolean,
    required: true,
    default: false
  }

}, // Options
{
  timestamps: true
})

const Client = model('Client', ClientSchema)

export { Client, ClientDocument, ClientInterface }
