import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";

import { Button } from "../atoms/Button";
import { DonationForm } from "../../data/types/donationForm";
import DonationFormInfoDisplay from "./DonationFormInfoDisplay";
import DonationFormInfoModal from "./DonationFormInfoModal";
import DonationFormMatchingCard from "../atoms/DonationFormMatchingCard";
import RequestGroup from "../../data/types/requestGroup";
import { useEffect } from "react";
interface MatchingDonationFormViewProps {
    donationForm: DonationForm;
    isSaved: boolean;
    isMatching: boolean;
    matchingError: string;
    onBrowseDonationForms: () => void;
    onConfirmMatches: () => void;
}

const MatchingDonationFormView: FunctionComponent<MatchingDonationFormViewProps> = (
    props: MatchingDonationFormViewProps
) => {
    const [availableDonations, setAvailableDonations] = useState<DonationForm[]>([]);
    const [sortByEarliest, setSortByEarliest] = useState(true);
    const [curInfoModalShown, setCurInfoModalShown] = useState<string>("");

    useEffect(() => {
        const newDonations = availableDonations;
        const index = availableDonations.findIndex((donationForm) => donationForm._id === props.donationForm._id);
        if (index !== -1) {
            newDonations[index] = props.donationForm;
            setAvailableDonations(newDonations);
        }
    }, [props.donationForm]);

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

    const donationsByRequestGroupQuery = gql`
        query AllDonationFormsByRequestGroup($id: ID) {
            requestGroup(_id: $id) {
                donationForms {
                    _id
                    contact {
                        firstName
                        lastName
                    }
                    name
                    age
                    description
                    quantity
                    quantityRemaining
                    createdAt
                    donatedAt
                    adminNotes
                }
            }
        }
    `;

    useQuery(donationsByRequestGroupQuery, {
        variables: { id: props.donationForm?.requestGroup?._id },
        skip: !props.donationForm.requestGroup,
        onCompleted: (data: { requestGroup: RequestGroup }) => {
            const res = JSON.parse(JSON.stringify(data.requestGroup)); // deep-copy since data object is frozen
            setAvailableDonations(res.donationForms);
        }
    });

    return (
        <div className="matching-donation-form-view">
            {props.donationForm.requestGroup && (
                <div className="matching-donation-form-view-header">
                    {props.isMatching ? (
                        <button className="matching-donation-form-view-browse" onClick={props.onBrowseDonationForms}>
                            <i className="bi bi-arrow-left-circle"></i>
                            <span>Go to all {props.donationForm.name}</span>
                        </button>
                    ) : (
                        <h1>Available Donations</h1>
                    )}
                </div>
            )}

            <div className="matching-donation-form-view-content">
                {props.isMatching ? (
                    <div className="single-donation">
                        <DonationFormInfoDisplay
                            donationForm={props.donationForm}
                            isMatching={props.isMatching}
                            onSelectMatch={() => {}} // TODO: select match
                        />
                    </div>
                ) : (
                    <div className="all-available-donations">
                        <div className="sort-header">
                            <p>Sort date by: {sortByEarliest ? "Earliest to latest" : "Latest to earliest"}</p>
                            <i className="bi bi-arrow-down-up" onClick={onChangeSort}></i>
                        </div>
                        <div className="donation-form-card-list">
                            {availableDonations.map((donationForm) => (
                                <div key={donationForm._id}>
                                    <DonationFormMatchingCard
                                        donationForm={donationForm}
                                        onSelectMatch={() => {}}
                                        onViewForm={() => setCurInfoModalShown(donationForm._id!)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {props.isMatching && (
                <div className="matching-donation-form-view-footer">
                    <p className={"footer-text " + (props.matchingError && "error ") + (props.isSaved && "saved")}>
                        {props.matchingError !== "" ? props.matchingError : props.isSaved ? "Saved!" : ""}
                    </p>
                    <Button text="Confirm matches" copyText="" onClick={props.onConfirmMatches} />
                </div>
            )}
            {curInfoModalShown !== "" && (
                <DonationFormInfoModal
                    donationForm={availableDonations.find((form) => form._id === curInfoModalShown)!}
                    handleClose={() => setCurInfoModalShown("")}
                />
            )}
        </div>
    );
};

export default MatchingDonationFormView;
