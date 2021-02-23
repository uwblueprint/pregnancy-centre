import Request from './request'

export default interface RequestType {
  _id?: string;
  name?: string;
  deleted?: boolean;
  requests?: {
      fulfilled?: [Request];
      deleted?: [Request];
      open?: [Request];
  }
}
