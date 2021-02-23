import RequestType from './requestType'

export default interface Request {
  _id?: string;
  name?: string;
  deleted?: boolean;
  description?: string;
  requirements?: string;
  image?: string;
  requestTypes?: [RequestType];
}
