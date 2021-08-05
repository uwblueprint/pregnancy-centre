import { DonationForm } from "./donationForm";
import Request from "./request";
import RequestType from "./requestType";

export default interface RequestGroup {
    _id?: string;
    name?: string;
    description?: string;
    image?: string;
    requestTypes?: RequestType[];
    donationForms?: DonationForm[];
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    deleted?: boolean;
    countOpenRequests?: number;
    nextRequest?: Request;
    nextRecipient?: string;
    hasAnyRequests?: boolean;
}
