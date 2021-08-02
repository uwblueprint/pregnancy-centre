import React, { FunctionComponent } from "react";

import { DonationForm } from "../../data/types/donationForm";
import DonationMatchingRequestsTable from "../molecules/DonationMatchingRequestsTable";
import MatchingRequestTypeDropdownList from "./MatchingRequestTypeDropdownList";
import Request from "../../data/types/request";

interface Props {
    requests: Request[];
    donationForm: DonationForm;
    isMatching: boolean;
    isErroneous: boolean;
    onQuantitySelected: (newQuantity: number, requestId: string) => void;
}

const MatchingRequestsView: FunctionComponent<Props> = (props: Props) => {
    const requestGroup = props.donationForm.requestGroup;
    return (
        <div className="matching-requests-view">
            <div className="matching-requests-view-header">
                <h1 className="title">{props.donationForm.name}</h1>
            </div>
            <div className="matching-requests-view-content">
                {!requestGroup && <div className="matching-requests-view-clients-header">All clients</div>}
                {requestGroup ? (
                    <MatchingRequestTypeDropdownList
                        requestTypes={requestGroup.requestTypes ?? []}
                        donationForm={props.donationForm}
                        isMatching={props.isMatching}
                        isErroneous={props.isErroneous}
                        onQuantitySelected={props.onQuantitySelected}
                    />
                ) : (
                    <div>
                        <DonationMatchingRequestsTable
                            requests={props.requests}
                            donationForm={props.donationForm}
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
