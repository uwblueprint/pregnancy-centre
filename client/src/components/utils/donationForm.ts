import { ItemCondition } from "../../data/types/donationForm";

export const ItemConditionToDescriptionMap = new Map<ItemCondition, string>([
    [ItemCondition.BRAND_NEW, "Brand New (still in package)"],
    [ItemCondition.GREAT, "Great (rarely used and no damages)"],
    [ItemCondition.GOOD, "Good (used and acceptable)"],
    [ItemCondition.FAIR, "Fair (used and slightly damaged)"],
    [ItemCondition.POOR, "Poor (used and fairly damaged)"]
]);

export const ItemConditionToShortDescriptionMap = new Map<ItemCondition, string>([
  [ItemCondition.BRAND_NEW, "Brand New"],
  [ItemCondition.GREAT, "Great"],
  [ItemCondition.GOOD, "Good"],
  [ItemCondition.FAIR, "Fair"],
  [ItemCondition.POOR, "Poor"]
]);

// Item with age <=0 has description itemAgeDescriptions[0]
// Item with age 1 has description itemAgeDescriptions[1]
// etc.
export const itemAgeDescriptions = ["Less than a year", "1 year", "2 years", "3 years", "More than 3 years"];

export const getItemAgeDescription = (age: number): string => {
    const descriptionArr = ["Less than a year", "1 year", "2 years", "3 years", "More than 3 years"];
    if (age < 0) {
        return descriptionArr[0];
    }
    if (age >= descriptionArr.length) {
        return descriptionArr[descriptionArr.length - 1];
    }
    return descriptionArr[age];
};
