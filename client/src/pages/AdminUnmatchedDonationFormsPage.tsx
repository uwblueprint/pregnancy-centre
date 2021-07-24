import React, { FunctionComponent } from "react";

import { DonationItemStatus, ItemCondition } from "../data/types/donationForm";
import AdminPage from "../components/layouts/AdminPage";
import UnmatchedDonationFormsTable from "../components/molecules/UnmatchedDonationFormsTable";

const AdminUnmatchedDonationFormPage: FunctionComponent = () => {
    const donationForms = [
        {
            _id: "1",
            adminNotes: "[test] admin notes",
            age: 3,
            condition: ItemCondition.FAIR,
            contact: {
                firstName: "Jane",
                lastName: "Doe",
                email: "janedoe@gmail.com",
                phoneNumber: "123-456-1234"
            },
            createdAt: new Date(),
            description: "[test] description",
            name: "Bassinet",
            quantity: 3,
            quantityRemaining: 3,
            requestGroup: { name: "Bassinet" },
            status: DonationItemStatus.PENDING_APPROVAL,
            updatedAt: new Date()
        },
        {
            _id: "2",
            adminNotes: "[test] admin notes",
            age: 3,
            condition: ItemCondition.FAIR,
            contact: {
                firstName: "Jane",
                lastName: "Doe",
                email: "janedoe@gmail.com",
                phoneNumber: "123-456-1234"
            },
            createdAt: new Date(),
            description: "[test] description",
            name: "Bassinet",
            quantity: 3,
            quantityRemaining: 3,
            requestGroup: { name: "Bassinet" },
            status: DonationItemStatus.PENDING_DROPOFF,
            updatedAt: new Date()
        },
        {
            _id: "3",
            adminNotes: "[test] admin notes",
            age: 3,
            condition: ItemCondition.FAIR,
            contact: {
                firstName: "Jane",
                lastName: "Doe",
                email: "janedoe@gmail.com",
                phoneNumber: "123-456-1234"
            },
            createdAt: new Date(),
            description: "[test] description",
            name: "Bassinet",
            quantity: 3,
            quantityRemaining: 3,
            requestGroup: { name: "Bassinet" },
            status: DonationItemStatus.PENDING_MATCH,
            updatedAt: new Date()
        }
    ];
    return (
        <AdminPage>
            <UnmatchedDonationFormsTable donationForms={donationForms} />
        </AdminPage>
    );
};

export default AdminUnmatchedDonationFormPage;
