import Request from "./request";
import RequestGroup from "./requestGroup";

export default interface RequestType {
    _id?: string;
    name?: string;
    requestGroup?: RequestGroup;
    requests?: Request[];
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    deleted?: boolean;
    openRequests?: Request[];
    fulfilledRequests?: Request[];
    deletedRequests?: Request[];
    countOpenRequests?: number;
    nextRequest?: Request;
    nextRecipient?: string;
}
