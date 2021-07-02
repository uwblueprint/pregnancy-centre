import React, { FunctionComponent } from "react";

import DonationForm, { ItemCondition, ItemConditionToDescriptionMap } from "../../data/types/donationForm";
import DonationItemCard from "../atoms/DonationItemCard";

const DonationItemCardContainer: FunctionComponent<Record<string, never>> = () => {
    const donationForm: DonationForm = {
        name: "Bassinet",
        condition: ItemCondition.GOOD,
        quantity: 2,
        age: 0,
        description: "Meant for infants ages 0-1, Overhead cover & small mattress included"
    };
    const donationFormWithLongDescription: DonationForm = {
        name: "Bassinet",
        condition: ItemCondition.BRAND_NEW,
        quantity: 2,
        age: 1,
        description:
            "Lorem Ipsum is simply dummy text of the \nprinting and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since \nthe 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    };
    const donationFormWithNoDescription: DonationForm = {
        name: "Bassinet",
        condition: ItemCondition.GOOD,
        quantity: 2,
        age: 2
    };

    return (
        <div
            style={{
                marginTop: "30px",
                marginLeft: "30px",
                display: "flex",
                flexDirection: "column",
                width: "70%"
            }}
        >
            <h3>Normal donation item</h3>
            <DonationItemCard
                donationForm={donationForm}
                showDeleteIcon={true}
                onEdit={() => console.log("Edit")}
                onDelete={() => console.log("Delete")}
            />
            <h3>Donation item with no delete icon</h3>
            <DonationItemCard
                donationForm={donationForm}
                showDeleteIcon={false}
                onEdit={() => console.log("Edit")}
                onDelete={() => console.log("Delete")}
            />
            <h3>Donation item with long description and newlines</h3>
            <DonationItemCard
                donationForm={donationFormWithLongDescription}
                showDeleteIcon={true}
                onEdit={() => console.log("Edit")}
                onDelete={() => console.log("Delete")}
            />
            <h3>Donation item with no description</h3>
            <DonationItemCard
                donationForm={donationFormWithNoDescription}
                showDeleteIcon={true}
                onEdit={() => console.log("Edit")}
                onDelete={() => console.log("Delete")}
            />
        </div>
    );
};

export default DonationItemCardContainer;
