import React, { FunctionComponent, useState } from "react";
import gql from "graphql-tag";

import { Button } from "../atoms/Button";
import { DonationForm } from "../../data/types/donationForm";

interface Props {
    donationForm: DonationForm;
    isSaved: boolean;
    isMatching: boolean;
    matchingError: string;
}

const MatchingDonationFormView: FunctionComponent<Props> = (props: Props) => {
    const [availableDonations, setAvailableDonations] = useState<DonationForm[]>([]);
    const [sortByEarliest, setSortByEarliest] = useState<boolean>(true);

    const onChangeSort = () => {
        const newSortByEarliest = !sortByEarliest;
        setSortByEarliest(newSortByEarliest);
        const sortedDonations = availableDonations.sort((a, b) => {
            if (newSortByEarliest) {
                return b!.createdAt!.valueOf() - a!.createdAt!.valueOf();
            }

            return a!.createdAt!.valueOf() - b!.createdAt!.valueOf();
        });
        setAvailableDonations(sortedDonations);
    };

    const donationFormsQuery = gql`
        query AllDonationFormsByRequestGroup($id: ID) {
            requestGroup(_id: $id) {
                donationForms {
                    _id
                    contact {
                        firstName
                        lastName
                    }
                    quantity
                    quantityRemaining
                    createdAt
                    adminNotes
                }
            }
        }
    `;

    return (
        <div className="matching-donation-form-view">
            <div className="matching-donation-form-view-header">
                {props.isMatching ? (
                    <div className="matching-donation-form-view-browse">
                        <i className="bi bi-arrow-left-circle"></i>
                        <span>Go to all {props.donationForm.name}s</span>
                    </div>
                ) : (
                    <h1>Available Donations</h1>
                )}
            </div>
            <div className="matching-donation-form-view-content">
                {props.isMatching ? (
                    <div className="single-donation">Single Donation Form Info Display</div>
                ) : (
                    <div className="all-available-donations">
                        <div className="sort-header">
                            <p>Sort date by: {sortByEarliest ? "Earliest to latest" : "Latest to earliest"}</p>
                            <i className="bi bi-arrow-down-up" onClick={onChangeSort}></i>
                        </div>
                        <div>All available donation cards</div>
                    </div>
                )}
            </div>
            <div className="matching-donation-form-view-footer">
                <p className={"footer-text " + (props.matchingError && "error ") + (props.isSaved && "saved")}>
                    {props.matchingError !== "" ? props.matchingError : "Saved!"}
                </p>
                <Button text="Confirm matches" copyText="" onClick={() => {}} />
            </div>
        </div>
    );
};

export default MatchingDonationFormView;
