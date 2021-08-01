import { DonationFormContributionTuple } from "./donationForm";
import RequestType from "./requestType";

export default interface Request {
    _id?: string;
    quantity?: number;
    requestType?: RequestType;
    clientName?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    fulfilledAt?: Date;
    deleted?: boolean;
    fulfilled?: boolean;
    matchedDonations?: DonationFormContributionTuple[];
}
