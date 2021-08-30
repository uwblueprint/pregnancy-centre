import { DonationFormContact, ItemCondition, ItemStatus } from "../../data/types/donationForm";

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

export const ItemStatusToReadableString = new Map<ItemStatus, string>([
    [ItemStatus.PENDING_APPROVAL, "Pending Approval"],
    [ItemStatus.PENDING_DROPOFF, "Pending Dropoff"],
    [ItemStatus.PENDING_MATCH, "Pending Match"],
    [ItemStatus.MATCHED, "Matched"]
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

export const getContactName = (contact?: DonationFormContact): string | null => {
    const firstName = contact?.firstName ?? "";
    const lastName = contact?.lastName ?? "";
    if (contact == null || (firstName.length === 0 && lastName.length === 0)) {
        return null;
    }
    if (firstName.length !== 0 && lastName.length !== 0) {
        return firstName + " " + lastName;
    }
    if (firstName.length !== 0) {
        return firstName;
    }
    return lastName;
};

export const getContactEmail = (contact?: DonationFormContact): string | null => {
    const email = contact?.email ?? "";
    if (email.length == 0) {
        return null;
    }
    return email;
};
