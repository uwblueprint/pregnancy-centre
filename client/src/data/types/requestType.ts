export default interface RequestType {
  _id?: string;
  name: string;
  deleted: boolean;
  requests: {
      fulfilled: [string];
      deleted: [string];
      open: [string];
  }
}
