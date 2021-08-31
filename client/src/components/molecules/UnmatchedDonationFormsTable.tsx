import { gql, useMutation } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import moment from "moment";

import { DonationForm, ItemStatus } from "../../data/types/donationForm";
import { getContactName, ItemStatusToReadableString } from "../utils/donationForm";
import ConfirmDonationFormApprovalDialog from "../organisms/ConfirmDonationFormApprovalDialog";
import ConfirmDonationFormRejectDialog from "../organisms/ConfirmDonationFormRejectDialog";
import DonationEditFormModal from "../organisms/DonationEditFormModal";
import DonationFormInfoModal from "../organisms/DonationFormInfoModal";
import DonationFormProgressStepper from "../atoms/DonationFormProgressStepper";
import DropdownMenu from "../atoms/DropdownMenu";
import Tag from "../atoms/Tag";
import UnseenDot from "../atoms/UnseenDot";
import { useHistory } from "react-router-dom";

export interface Props {
    initialDonationForms: Array<DonationForm>;
}

const UnmatchedDonationFormsTable: FunctionComponent<Props> = (props: Props) => {
    const history = useHistory();
    const [donationForms, setDonationForms] = useState(props.initialDonationForms);
    const [selectedDonationFormForInspection, setSelectedDonationFormForInspection] = useState<DonationForm | null>(
        null
    );
    const [selectedDonationFormForApproval, setSelectedDonationFormForApproval] = useState<DonationForm | null>(null);
    const [selectedDonationFormForDropoff, setSelectedDonationFormForDropoff] = useState<DonationForm | null>(null);
    const [selectedDonationFormForReject, setSelectedDonationFormForReject] = useState<DonationForm | null>(null);

    const sendRejectionEmailMutation = gql`
        mutation SendRejectionEmail($id: ID!) {
            sendRejectionEmail(id: $id)
        }
    `;

    const sendApprovalEmailMutation = gql`
        mutation SendApprovalEmail($id: ID) {
            sendApprovalEmail(id: $id)
        }
    `;

    const updateDonationFormStatusMutation = gql`
        mutation UpdateDonationFormStatus($id: ID!, $status: DonationItemStatus!, $donatedAt: String) {
            updateDonationForm(donationForm: { _id: $id, status: $status, donatedAt: $donatedAt }) {
                _id
            }
        }
    `;

    const deleteDonationFormMutation = gql`
        mutation DeleteDonationForm($id: ID!) {
            deleteDonationForm(_id: $id) {
                _id
            }
        }
    `;

    const [sendApprovalEmail] = useMutation(sendApprovalEmailMutation);
    const [sendRejectionEmail] = useMutation(sendRejectionEmailMutation);
    const [updateDonationFormStatus] = useMutation(updateDonationFormStatusMutation);
    const [deleteDonationForm] = useMutation(deleteDonationFormMutation);

    const getReadableStringForItemStatus = (itemStatus?: ItemStatus) => {
        if (itemStatus == null) {
            return null;
        }
        const readableStr = ItemStatusToReadableString.get(itemStatus);
        return readableStr ?? null;
    };

    const getTagClassnameForItemStatus = (itemStatus?: ItemStatus) => {
        switch (itemStatus) {
            case ItemStatus.PENDING_APPROVAL:
                return "pending-approval-tag";
            case ItemStatus.PENDING_DROPOFF:
                return "pending-dropoff-tag";
            case ItemStatus.PENDING_MATCH:
                return "pending-match-tag";
        }
        return "";
    };

    const getMenuOptionsForItemStatus = (donationForm: DonationForm, itemStatus?: ItemStatus) => {
        const options = [];
        switch (itemStatus) {
            case ItemStatus.PENDING_APPROVAL:
                options.push(
                    <span className="menu-option" onClick={() => setSelectedDonationFormForReject(donationForm)}>
                        Reject
                    </span>
                );
                break;
            case ItemStatus.PENDING_DROPOFF:
                options.push(
                    <span
                        className="menu-option"
                        onClick={() => setDonationFormStatus(donationForm._id!, ItemStatus.PENDING_APPROVAL)}
                    >
                        Unapprove
                    </span>
                );
                break;
            case ItemStatus.PENDING_MATCH:
                options.push(
                    <span
                        className="menu-option"
                        onClick={() => setDonationFormStatus(donationForm._id!, ItemStatus.PENDING_DROPOFF, null)}
                    >
                        Unconfirm
                    </span>
                );
                break;
        }
        options.push(
            <span className="menu-option" onClick={() => onDeleteDonationForm(donationForm._id!)}>
                Delete
            </span>
        );
        return options;
    };

    const setDonationFormStatus = (
        donationFormId: string,
        newStatus: ItemStatus,
        donatedAt?: string | null,
        updateCallback?: () => void
    ) => {
        updateDonationFormStatus({ variables: { id: donationFormId, status: newStatus, donatedAt } })
            .then(() => {
                if (newStatus === ItemStatus.MATCHED) {
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
                if (updateCallback) {
                    updateCallback();
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const removeDonationFormFromDisplay = (donationFormId: string) => {
        setDonationForms(donationForms.filter((donationForm) => donationForm._id !== donationFormId));
    };

    const onRejectDonationForm = (donationForm: DonationForm) => {
        sendRejectionEmail({ variables: { id: donationForm._id as string } });
        onDeleteDonationForm(donationForm._id as string);
        setSelectedDonationFormForReject(null);
    };

    const onDeleteDonationForm = (donationFormId: string) => {
        deleteDonationForm({ variables: { id: donationFormId } })
            .then(() => {
                removeDonationFormFromDisplay(donationFormId);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const onStatusChange = (donationForm: DonationForm, newStatus: ItemStatus) => {
        switch (newStatus) {
            case ItemStatus.PENDING_DROPOFF:
                setSelectedDonationFormForApproval(donationForm);
                break;
            case ItemStatus.PENDING_MATCH:
                setSelectedDonationFormForDropoff(donationForm);
                break;
            case ItemStatus.MATCHED:
                history.push("/matching/donation-form/" + donationForm._id);
                break;
        }
    };

    const onApproveDonationForm = (donationForm: DonationForm) => {
        setDonationFormStatus(donationForm._id as string, ItemStatus.PENDING_DROPOFF);
        sendApprovalEmail({ variables: { id: donationForm._id as string } });
        setSelectedDonationFormForApproval(null);
    };

    const onDropoffDonationForm = (donationForm: DonationForm) => {
        const updateDonationForm = () => {
            setDonationForms(
                donationForms.map((existingDonationForm) => {
                    if (existingDonationForm._id === donationForm._id) {
                        existingDonationForm.quantity = donationForm.quantity;
                        existingDonationForm.adminNotes = donationForm.adminNotes;
                    }
                    return existingDonationForm;
                })
            );
        };
        setDonationFormStatus(
            donationForm._id as string,
            ItemStatus.PENDING_MATCH,
            Date.now().toString(),
            updateDonationForm
        );
        setSelectedDonationFormForDropoff(null);
    };
    return (
        <div className="unmatched-donation-forms-table">
            {selectedDonationFormForInspection && (
                <DonationFormInfoModal
                    donationFormId={selectedDonationFormForInspection._id}
                    handleClose={() => {
                        setSelectedDonationFormForInspection(null);
                    }}
                />
            )}
            {selectedDonationFormForApproval && (
                <ConfirmDonationFormApprovalDialog
                    contactName={getContactName(selectedDonationFormForApproval.contact)}
                    handleClose={() => {
                        setSelectedDonationFormForApproval(null);
                    }}
                    onCancel={() => {
                        setSelectedDonationFormForApproval(null);
                    }}
                    onSubmit={() => {
                        onApproveDonationForm(selectedDonationFormForApproval);
                    }}
                />
            )}
            {selectedDonationFormForReject && (
                <ConfirmDonationFormRejectDialog
                    contactName={getContactName(selectedDonationFormForReject.contact)}
                    itemName={selectedDonationFormForReject.name!}
                    handleClose={() => {
                        setSelectedDonationFormForReject(null);
                    }}
                    onCancel={() => {
                        setSelectedDonationFormForReject(null);
                    }}
                    onSubmit={() => {
                        onRejectDonationForm(selectedDonationFormForReject);
                    }}
                />
            )}
            {selectedDonationFormForDropoff && (
                <DonationEditFormModal
                    donationForm={selectedDonationFormForDropoff}
                    handleClose={() => {
                        setSelectedDonationFormForDropoff(null);
                    }}
                    onSubmitComplete={onDropoffDonationForm}
                />
            )}
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
                    {donationForms.map((donationForm: DonationForm, index) => (
                        <>
                            <tr
                                key={donationForm._id}
                                className="data-row"
                                onClick={() => {
                                    setSelectedDonationFormForInspection(donationForm);
                                    const newDonationForms = donationForms;
                                    newDonationForms[index].seen == true;
                                    setDonationForms(newDonationForms)
                                }}
                            >
                                <td className="spacing-col"> {donationForm.seen ? <></> : <UnseenDot />}</td>

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
                                            onStatusChange={(newStatus: ItemStatus) => {
                                                onStatusChange(donationForm, newStatus);
                                            }}
                                        />
                                    )}
                                </td>
                                <td className="menu-col">
                                    <DropdownMenu trigger={<i className="bi bi-three-dots" />}>
                                        {donationForm._id &&
                                            getMenuOptionsForItemStatus(donationForm, donationForm.status)}
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
