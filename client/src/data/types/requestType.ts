import Client from "./client";
import Request from "./request";
import RequestGroup from "./requestGroup";

export default interface RequestType {
    _id?: string;
    name?: string;
    dateUpdated?: Date;
    deleted?: boolean;
    requests?: Request[];
    requestGroup?: RequestGroup;
    numOpen?: number;
    nextRecipient?: Client;
}
