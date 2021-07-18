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
    age?: number;
    condition?: ItemCondition;
    description?: string;
    name?: string;
    quantity?: number;
    requestGroup?: RequestGroup | null;
}
