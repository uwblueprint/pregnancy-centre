import { Document, model, Schema, Types } from 'mongoose'

interface ClientInterface extends Document {
  _id: Types.ObjectId

  // Properties
  fullName: string

  // Timestamps
  createdAt: Date
  updatedAt: Date

  // Timestamps for Statuses
  deletedAt: Date
}

const ClientSchema = new Schema({
  // Properties
  fullName: {
    type: String,
    required: true,
    trim: true
  },

  // Timestamps for Statuses
  deletedAt: {
    type: Date
  }

}, // Options
{
  timestamps: true
})

const Client = model<ClientInterface>('Client', ClientSchema)

export { Client, ClientInterface }
