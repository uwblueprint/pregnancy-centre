import RequestGroup from "./requestGroup";

export enum ItemCondition {
    BRAND_NEW = "BRAND_NEW",
    GREAT = "GREAT",
    GOOD = "GOOD",
    FAIR = "FAIR",
    POOR = "POOR"
}

export enum ItemStatus {
    PENDING_APPROVAL = "PENDING_APPROVAL",
    PENDING_DROPOFF = "PENDING_DROPOFF",
    PENDING_MATCH = "PENDING_MATCH",
    MATCHED = "MATCHED"
}

export interface DonationFormContributionTuple {
    donationForm: string;
    quantity: number;
}
export interface DonationFormContact {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
}

export interface DonationForm {
    _id?: string;
    contact?: DonationFormContact;
    name?: string;
    requestGroup?: RequestGroup | null;
    description?: string;
    quantity?: number;
    age?: number;
    condition?: ItemCondition;

    adminNotes?: string;
    status?: ItemStatus;
    quantityRemaining?: number;

    donatedAt?: number;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
}

export interface UpdateRequestsInput {
    _id?: string;
    matchedDonations?: DonationFormContributionTuple[];
}
