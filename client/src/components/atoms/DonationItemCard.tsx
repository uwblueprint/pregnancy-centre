import React, { FunctionComponent } from "react";

import { getItemAgeDescription, ItemConditionToShortDescriptionMap } from "../utils/donationForm";
import DonationForm from "../../data/types/donationForm";

interface DonationItemCardProps {
    donationForm: DonationForm;
    onEdit: () => void;
    onDelete: () => void;
    showDeleteIcon: boolean;
    showEditIcon: boolean;
}

const DonationItemCard: FunctionComponent<DonationItemCardProps> = (props: DonationItemCardProps) => {
    const itemAttributeField = (name: string, value?: string, className?: string) =>
        value && (
            <div className={"item-attribute-field " + className ?? ""}>
                <h2>{name}:</h2>
                <h3>{value}</h3>
            </div>
        );
    return (
        <div className="donation-item-card">
            <div className="item-details">
                <h1>{props.donationForm.name}</h1>
                {props.donationForm.condition &&
                    itemAttributeField(
                        "Condition",
                        ItemConditionToShortDescriptionMap.get(props.donationForm.condition)
                    )}
                {itemAttributeField("Quantity", props.donationForm.quantity?.toString())}
                {itemAttributeField(
                    "Age of Item",
                    props.donationForm.age ? getItemAgeDescription(props.donationForm.age) : "Unknown"
                )}
                {itemAttributeField("Description", props.donationForm.description, "item-description-field")}
            </div>
            <div className="action-icons">
                {props.showEditIcon && <i className="bi bi-pencil" onClick={props.onEdit} />}
                {props.showDeleteIcon && <i className="bi bi-trash" onClick={props.onDelete} />}
            </div>
        </div>
    );
};

export default DonationItemCard;
