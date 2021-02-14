/* Imports from local files */
import Tag from './tag'

export default interface Request {
  _id?: string;
  archived?: boolean;
  date_created?: Date;
  deleted?: boolean;
  description?: string;
  fulfilled?: boolean;
  image?: string;
  name?: string;
  priority?: number;
  request_id?: string;
  tags?: [Tag];
}
