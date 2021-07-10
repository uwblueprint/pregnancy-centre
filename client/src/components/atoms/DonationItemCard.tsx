import React, { FunctionComponent } from "react";

import DonationForm from "../../data/types/donationForm";

interface DonationItemCardProps {
  donationForm: DonationForm;
  showDeleteIcon: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const DonationItemCard: FunctionComponent<DonationItemCardProps> = (
  props: DonationItemCardProps
) => {
  const itemAttributeField = (
    name: string,
    value?: string,
    className?: string
  ) =>
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
        {itemAttributeField("Condition", props.donationForm.condition)}
        {itemAttributeField(
          "Quantity",
          props.donationForm.quantity?.toString()
        )}
        {itemAttributeField("Age of Item", props.donationForm.age)}
        {itemAttributeField(
          "Description",
          props.donationForm.description,
          "item-description-field"
        )}
      </div>
      <div className="action-icons">
        <i className="bi bi-pencil" onClick={props.onEdit} />
        {props.showDeleteIcon && (
          <i className="bi bi-trash" onClick={props.onDelete} />
        )}
      </div>
    </div>
  );
};

export default DonationItemCard;
