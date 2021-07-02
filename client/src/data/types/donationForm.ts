import RequestGroup from "./requestGroup";

export enum ItemCondition {
    BRAND_NEW = "BRAND_NEW",
    GREAT = "GREAT",
    GOOD = "GOOD",
    FAIR = "FAIR",
    POOR = "POOR"
}

export const ItemConditionToDescriptionMap = new Map<ItemCondition, string>([
    [ItemCondition.BRAND_NEW, "Brand New (still in package)"],
    [ItemCondition.GREAT, "Great (rarely used and no damages)"],
    [ItemCondition.GOOD, "Good (used and acceptable)"],
    [ItemCondition.FAIR, "Fair (used and slightly damaged)"],
    [ItemCondition.POOR, "Poor (used and fairly damaged)"]
]);

export const ItemAgeToDescriptionMap = new Map<number, string>([
    [0, "Less than a year"],
    [1, "1 year"],
    [2, "2 years"],
    [3, "3 years"],
    [4, "More than 3 years"]
]);

export default interface DonationForm {
  _id?: string;
  age?: number;
  condition?: ItemCondition;
  description?: string;
  name?: string;
  quantity?: number;
  requestGroup?: RequestGroup | null;
}
