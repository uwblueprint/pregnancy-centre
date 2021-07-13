import RequestGroup from "./requestGroup";

export default interface DonationForm {
    _id?: string;
    age?: string;
    condition?: string;
    description?: string;
    name?: string;
    quantity?: number;
    requestGroup?: RequestGroup;
}
