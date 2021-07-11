import Donor from "./donor";
import RequestGroup from "./requestGroup";

export enum ItemCondition {
    BRAND_NEW = "BRAND_NEW",
    GREAT = "GREAT",
    GOOD = "GOOD",
    FAIR = "FAIR",
    POOR = "POOR"
}

export default interface DonationForm {
    _id?: string;
    adminNotes?: string;
    age?: number;
    condition?: ItemCondition;
    contact?: Donor;
    createdAt?: Date;
    description?: string;
    name?: string;
    quantity?: number;
    quantityRemaining?: number;
    requestGroup?: RequestGroup | null;
    updatedAt?: Date;
}
