import Client from "./client";
import RequestType from './requestType'

export default interface RequestGroup {
  _id?: string;
  name?: string;
  dateUpdated?: Date;
  deleted?: boolean;
  description?: string;
  requirements?: string;
  image?: string;
  requestTypes?: RequestType[];
  numOpen?: number;
  hasAnyRequests?: boolean;
  nextRecipient?: Client;
}
