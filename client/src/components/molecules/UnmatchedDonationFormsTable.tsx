import React, { FunctionComponent, useState } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";

import DonationForm, { DonationFormContact, DonationItemStatus } from "../../data/types/donationForm";
import DonationFormProgressStepper from "../atoms/DonationFormProgressStepper";
import DropdownMenu from "../atoms/DropdownMenu";
import { ItemStatusToReadableString } from "../utils/donationForm";
import Tag from "../atoms/Tag";

export interface Props {
    initialDonationForms: Array<DonationForm>;
}

const UnmatchedDonationFormsTable: FunctionComponent<Props> = (props: Props) => {
    const [donationForms, setDonationForms] = useState(props.initialDonationForms);

    const getContactName = (contact?: DonationFormContact) => {
        if (contact == null || (contact.firstName.length === 0 && contact.lastName.length === 0)) {
            return null;
        }
        if (contact.firstName.length !== 0 && contact.lastName.length !== 0) {
            return contact.firstName + " " + contact.lastName;
        }
        if (contact.firstName.length !== 0) {
            return contact.firstName;
        }
        return contact.lastName;
    };

    const getReadableStringForItemStatus = (itemStatus?: DonationItemStatus) => {
        if (itemStatus == null) {
            return null;
        }
        const readableStr = ItemStatusToReadableString.get(itemStatus);
        return readableStr ?? null;
    };

    const getTagClassnameForItemStatus = (itemStatus?: DonationItemStatus) => {
        switch (itemStatus) {
            case DonationItemStatus.PENDING_APPROVAL:
                return "pending-approval-tag";
            case DonationItemStatus.PENDING_DROPOFF:
                return "pending-dropoff-tag";
            case DonationItemStatus.PENDING_MATCH:
                return "pending-match-tag";
        }
        return "";
    };

    const getMenuOptionsForItemStatus = (donationFormId: string, itemStatus?: DonationItemStatus) => {
        const options = [];
        switch (itemStatus) {
            case DonationItemStatus.PENDING_DROPOFF:
                options.push(
                    <span
                        className="menu-option"
                        onClick={() => setDonationFormStatus(donationFormId, DonationItemStatus.PENDING_APPROVAL)}
                    >
                        Unapprove
                    </span>
                );
                break;
            case DonationItemStatus.PENDING_MATCH:
                options.push(
                    <span
                        className="menu-option"
                        onClick={() => setDonationFormStatus(donationFormId, DonationItemStatus.PENDING_DROPOFF)}
                    >
                        Unconfirm
                    </span>
                );
                break;
        }
        options.push(
            <span className="menu-option" onClick={() => deleteDonationForm(donationFormId)}>
                Delete
            </span>
        );
        return options;
    };

    const setDonationFormStatus = (donationFormId: string, newStatus: DonationItemStatus) => {
        // TODO(meganniu): call mutation to change donation form status
        if (newStatus === DonationItemStatus.MATCHED) {
            removeDonationFormFromDisplay(donationFormId);
            return;
        }
        setDonationForms(
            donationForms.map((donationForm) => {
                if (donationForm._id === donationFormId) {
                    donationForm.status = newStatus;
                }
                return donationForm;
            })
        );
    };

    const removeDonationFormFromDisplay = (donationFormId: string) => {
        setDonationForms(donationForms.filter((donationForm) => donationForm._id !== donationFormId));
    };

    const deleteDonationForm = (donationFormId: string) => {
        // TODO(meganniu): call mutation to delete donation form
        removeDonationFormFromDisplay(donationFormId);
    };

    return (
        <div className="unmatched-donation-forms-table">
            <table>
                <colgroup>
                    <col className="spacing-col" />
                    <col className="item-col" />
                    <col className="contact-col" />
                    <col className="quantity-col" />
                    <col className="date-submitted-col" />
                    <col className="status-col" />
                    <col className="status-progress-col" />
                    <col className="menu-col" />
                    <col className="spacing-col" />
                </colgroup>
                <thead>
                    <tr>
                        <th className="spacing-col" />
                        <th className="item-col">Item</th>
                        <th className="contact-col">Donor name</th>
                        <th className="quantity-col">Quantity</th>
                        <th className="date-submitted-col">Date submitted</th>
                        <th className="status-col">Status</th>
                        <th className="status-progress-col">Actions</th>
                        <th className="menu-col"></th>
                        <th className="spacing-col" />
                    </tr>
                </thead>
                <tbody>
                    <tr className="spacing-row">
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                    </tr>
                    {donationForms.sort().map((donationForm: DonationForm) => (
                        <>
                            <tr
                                key={donationForm._id}
                                className="data-row"
                                // onClick={() => {
                                //     history.push("/match-need/" + donationForm.requestGroup._id);
                                // }}
                            >
                                <td className="spacing-col" />
                                <td className="item-col">{donationForm.name}</td>
                                <td className="contact-col">{getContactName(donationForm.contact) ?? "N/A"}</td>
                                <td className="quantity-col">{donationForm.quantity}</td>
                                <td className="date-submitted-col">
                                    <div className="date-submitted">
                                        <span>
                                            {donationForm.createdAt
                                                ? moment(donationForm.createdAt, "x").format("MMMM DD, YYYY")
                                                : "N/A"}
                                        </span>
                                        <span>
                                            {donationForm.createdAt
                                                ? moment(donationForm.createdAt, "x").format("h:mm a")
                                                : "N/A"}
                                        </span>
                                    </div>
                                </td>
                                <td className="status-col">
                                    <Tag
                                        className={getTagClassnameForItemStatus(donationForm.status)}
                                        text={getReadableStringForItemStatus(donationForm.status) ?? "N/A"}
                                    />
                                </td>
                                <td className="status-progress-col">
                                    {donationForm.status && (
                                        <DonationFormProgressStepper
                                            status={donationForm.status}
                                            onStatusChange={(newStatus: DonationItemStatus) => {
                                                if (donationForm._id) {
                                                    setDonationFormStatus(donationForm._id, newStatus);
                                                }
                                            }}
                                        />
                                    )}
                                </td>
                                <td className="menu-col">
                                    <DropdownMenu trigger={<i className="bi bi-three-dots" />}>
                                        {donationForm._id &&
                                            getMenuOptionsForItemStatus(donationForm._id, donationForm.status)}
                                    </DropdownMenu>
                                </td>
                                <td className="spacing-col" />
                            </tr>
                            <tr className="border-row">
                                <td className="spacing-col" />
                                <td>
                                    <div className="border-line" />
                                </td>
                                <td>
                                    <div className="border-line" />
                                </td>
                                <td>
                                    <div className="border-line" />
                                </td>
                                <td>
                                    <div className="border-line" />
                                </td>
                                <td>
                                    <div className="border-line" />
                                </td>
                                <td>
                                    <div className="border-line" />
                                </td>
                                <td>
                                    <div className="border-line" />
                                </td>
                                <td className="spacing-col" />
                            </tr>
                        </>
                    ))}
                </tbody>
            </table>
            {donationForms.length === 0 && <span className="no-forms-msg">There are no donation forms.</span>}
        </div>
    );
};

export default UnmatchedDonationFormsTable;
