import Client from "./client";

export default interface Request {
  _id?: string;
  requestId?: string;
  client?: Client;
  dateUpdated?: Date;
  dateCreated?: Date;
  dateFulfilled?: Date;
  deleted?: boolean;
  fulfilled?: boolean;
  requestType?: string;
}
