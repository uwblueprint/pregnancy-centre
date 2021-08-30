import { gql, useMutation } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import moment from "moment";

import { Button } from "../atoms/Button";
import ConfirmDonationFormUnmatchDialog from "../organisms/ConfirmDonationFormUnmatchDialog";
import { DonationForm } from "../../data/types/donationForm";
import { getContactName } from "../utils/donationForm";
import { useHistory } from "react-router-dom";

export interface Props {
    initialDonationForms: Array<DonationForm>;
}

const MatchedDonationFormsTable: FunctionComponent<Props> = (props: Props) => {
    const [donationForms, setDonationForms] = useState(props.initialDonationForms);
    const [selectedDonationFormForUnmatch, setSelectedDonationFormForUnmatch] = useState<DonationForm | null>(null);
    const history = useHistory();

    const unmatchDonationFormMutation = gql`
        mutation UnmatchDonationForm($id: ID!) {
            updateDonationForm(donationForm: { _id: $id, status: PENDING_MATCH, matchedAt: null }) {
                _id
            }
        }
    `;

    const [_unmatchDonationForm] = useMutation(unmatchDonationFormMutation);

    const removeDonationFormFromDisplay = (donationFormId: string) => {
        setDonationForms(donationForms.filter((donationForm) => donationForm._id !== donationFormId));
    };

    const unmatchDonationForm = (donationFormId: string) => {
        _unmatchDonationForm({ variables: { id: donationFormId } })
            .then(() => {
                removeDonationFormFromDisplay(donationFormId);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="matched-donation-forms-table">
            {selectedDonationFormForUnmatch && (
                <ConfirmDonationFormUnmatchDialog
                    contactName={getContactName(selectedDonationFormForUnmatch.contact)}
                    handleClose={() => {
                        setSelectedDonationFormForUnmatch(null);
                    }}
                    itemName={selectedDonationFormForUnmatch.name ?? null}
                    onCancel={() => {
                        setSelectedDonationFormForUnmatch(null);
                    }}
                    onSubmit={(e: React.FormEvent) => {
                        e.preventDefault();
                        unmatchDonationForm(selectedDonationFormForUnmatch._id as string);
                        setSelectedDonationFormForUnmatch(null);
                    }}
                />
            )}
            <table>
                <colgroup>
                    <col className="spacing-col" />
                    <col className="item-col" />
                    <col className="contact-col" />
                    <col className="quantity-col" />
                    <col className="date-matched-col" />
                    <col className="unmatch-btn-col" />
                    <col className="spacing-col" />
                </colgroup>
                <thead>
                    <tr>
                        <th className="spacing-col" />
                        <th className="item-col">Item</th>
                        <th className="contact-col">Donor name</th>
                        <th className="quantity-col">Quantity</th>
                        <th className="date-matched-col">Date matched</th>
                        <th className="unmatch-btn-col" />
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
                    {donationForms.map(
                        (donationForm: DonationForm) =>
                            donationForm._id && (
                                <>
                                    <tr
                                        key={donationForm._id}
                                        className="data-row"
                                        onClick={() => {
                                            history.push(`/matched-form/${donationForm._id}`);
                                        }}
                                    >
                                        <td className="spacing-col" />
                                        <td className="item-col">{donationForm.name}</td>
                                        <td className="contact-col">{getContactName(donationForm.contact) ?? "N/A"}</td>
                                        <td className="quantity-col">{donationForm.quantity}</td>
                                        <td className="date-matched-col">
                                            <div className="date-matched">
                                                <span>
                                                    {donationForm.matchedAt
                                                        ? moment(donationForm.matchedAt, "x").format("MMMM DD, YYYY")
                                                        : "N/A"}
                                                </span>
                                                <span>
                                                    {donationForm.matchedAt
                                                        ? moment(donationForm.matchedAt, "x").format("h:mm a")
                                                        : "N/A"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="unmatch-btn-col">
                                            <Button
                                                text="Unmatch"
                                                copyText=""
                                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                    e.stopPropagation();
                                                    setSelectedDonationFormForUnmatch(donationForm);
                                                }}
                                            />
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
                                        <td className="spacing-col" />
                                    </tr>
                                </>
                            )
                    )}
                </tbody>
            </table>
            {donationForms.length === 0 && <span className="no-forms-msg">There are no matched donation forms.</span>}
        </div>
    );
};

export default MatchedDonationFormsTable;
