import Client from "./client";
import RequestType from "./requestType";

export default interface Request {
  _id?: string
  quantity?: number
  requestType?: RequestType
  client?: Client
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  fulfilledAt?: Date
  deleted?: boolean
  fulfilled?: boolean
}
