import Request from './request'

export default interface RequestType {
  _id?: string;
  name?: string;
  dateUpdated?: Date;
  deleted?: boolean;
  requests?: Request[];
  requestGroup?: string;
  numOpen?: number
}
