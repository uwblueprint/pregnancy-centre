export default interface Request {
  _id?: string;
  requestId?: string;
  clientId?: string;
  dateUpdated?: Date;
  dateCreated?: Date;
  dateFulfilled?: Date;
  deleted?: boolean;
  fulfilled?: boolean;
}
