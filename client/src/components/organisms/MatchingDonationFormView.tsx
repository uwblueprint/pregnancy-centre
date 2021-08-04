import React, { FunctionComponent, useState } from "react";

import { Button } from "../atoms/Button";
import { DonationForm } from "../../data/types/donationForm";
import DonationFormInfoDisplay from "./DonationFormInfoDisplay";
import DonationFormInfoModal from "./DonationFormInfoModal";
import DonationFormMatchingCard from "../atoms/DonationFormMatchingCard";
import { useEffect } from "react";
interface MatchingDonationFormViewProps {
    donationForm: DonationForm;
    availableDonations: DonationForm[];
    isSaved: boolean;
    isMatching: boolean;
    matchingError: string;
    onBrowseDonationForms: () => void;
    onDonationFormSelect: (id: string) => void;
    onConfirmMatches: () => void;
}

const MatchingDonationFormView: FunctionComponent<MatchingDonationFormViewProps> = (
    props: MatchingDonationFormViewProps
) => {
    const [availableDonations, setAvailableDonations] = useState<DonationForm[]>(props.availableDonations);
    const [sortByEarliest, setSortByEarliest] = useState(true);
    const [curInfoModalShown, setCurInfoModalShown] = useState<string>("");

    useEffect(() => {
        const sortedDonations = props.availableDonations.sort((a, b) => {
            if (sortByEarliest) {
                return b!.createdAt!.valueOf() - a!.createdAt!.valueOf();
            }
            return a!.createdAt!.valueOf() - b!.createdAt!.valueOf();
        });
        setAvailableDonations(sortedDonations);
    }, [props.availableDonations, sortByEarliest]);

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
                            onSelectMatch={() => {}}
                        />
                    </div>
                ) : (
                    <div className="all-available-donations">
                        <div className="sort-header">
                            <p>Sort date by: {sortByEarliest ? "Earliest to latest" : "Latest to earliest"}</p>
                            <i className="bi bi-arrow-down-up" onClick={() => setSortByEarliest(!sortByEarliest)}></i>
                        </div>
                        <div className="donation-form-card-list">
                            {availableDonations.map((donationForm) => (
                                <div key={donationForm._id}>
                                    <DonationFormMatchingCard
                                        donationForm={donationForm}
                                        onSelectMatch={() => props.onDonationFormSelect(donationForm._id!)}
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
