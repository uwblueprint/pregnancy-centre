import { Document, model, Schema, Types } from 'mongoose'

interface ClientInterface {
  _id: Types.ObjectId

  // Properties
  fullName: string

  // Timestamps
  createdAt: Date
  updatedAt: Date

  // Timestamps for Statuses
  deletedAt: Date
}

type ClientDocument = ClientInterface & Document;

const ClientSchema = new Schema({
  // Properties
  fullName: {
    type: String,
    required: true,
    trim: true
  },

  // Timestamps for Statuses
  deleted: {
    type: Date
  }

}, // Options
{
  timestamps: true
})

const Client = model('Client', ClientSchema)

export { Client, ClientDocument, ClientInterface }
