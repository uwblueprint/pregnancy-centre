export default interface Request {
  _id?: string;
  request_id?: string;
  client_id?: string;
  date_created?: Date;
  date_fulfilled?: Date;
  deleted?: boolean;
  fulfilled?: boolean;
}
