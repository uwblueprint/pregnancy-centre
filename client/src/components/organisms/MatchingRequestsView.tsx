import React, { FunctionComponent } from "react";

import { Button } from "../atoms/Button";
import { DonationForm } from "../../data/types/donationForm";
import DonationMatchingRequestsTable from "../molecules/DonationMatchingRequestsTable";
import MatchingRequestTypeDropdownList from "./MatchingRequestTypeDropdownList";
import Request from "../../data/types/request";
import { useHistory } from "react-router-dom";

interface MatchingRequestViewProps {
    requests: Request[];
    donationForm: DonationForm;
    previousPage?: string;
    showFulfilledRequests?: boolean;
    showAssignedMatchesOnly?: boolean;
    isMatching: boolean;
    isErroneous: boolean;
    onQuantitySelected: (newQuantity: number, request: Request) => void;
}

const MatchingRequestsView: FunctionComponent<MatchingRequestViewProps> = (props: MatchingRequestViewProps) => {
    const requestGroup = props.donationForm.requestGroup;
    const history = useHistory();
    return (
        <div className="matching-requests-view">
            <div className="matching-requests-view-header">
                <h1 className="title">{props.donationForm.name}</h1>
                {!!props.previousPage && (
                    <Button
                        className="return-button"
                        text={`Go back to ${props.previousPage}`}
                        copyText=""
                        onClick={history.goBack}
                    />
                )}
            </div>
            <div className="matching-requests-view-content">
                {!requestGroup && <div className="matching-requests-view-clients-header">All clients</div>}
                {requestGroup ? (
                    <MatchingRequestTypeDropdownList
                        requestTypes={requestGroup.requestTypes ?? []}
                        donationForm={props.donationForm}
                        showFulfilledRequests={props.showFulfilledRequests || false}
                        showAssignedMatchesOnly={props.showAssignedMatchesOnly || false}
                        isMatching={props.isMatching}
                        isErroneous={props.isErroneous}
                        onQuantitySelected={props.onQuantitySelected}
                    />
                ) : (
                    <div>
                        <DonationMatchingRequestsTable
                            requests={props.requests}
                            donationForm={props.donationForm}
                            showAssignedMatchesOnly={props.showAssignedMatchesOnly || false}
                            isMatching={props.isMatching}
                            isErroneous={props.isErroneous}
                            onQuantitySelected={props.onQuantitySelected}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MatchingRequestsView;
