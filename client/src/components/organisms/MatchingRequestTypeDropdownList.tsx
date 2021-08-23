import React, { FunctionComponent } from "react";
import { DonationForm } from "../../data/types/donationForm";
import MatchingRequestTypeDropdown from "../molecules/MatchingRequestTypeDropdown";
import Request from "../../data/types/request";
import RequestType from "../../data/types/requestType";

interface Props {
    requestTypes: RequestType[];
    donationForm: DonationForm;
    showFulfilledRequests: boolean;
    showAssignedMatchesOnly?: boolean;
    isMatching: boolean;
    isErroneous: boolean;
    onQuantitySelected: (newQuantity: number, request: Request) => void;
}

const MatchingRequestTypeDropdownList: FunctionComponent<Props> = (props: Props) => {
    const undeletedRequestTypes = props.requestTypes.filter((requestType) => !requestType.deleted);
    return (
        <div className="donation-matching-dropdown-list">
            {undeletedRequestTypes.map((requestType) => {
                const requests = props.showFulfilledRequests ? requestType.requests : requestType.openRequests;
                // only display request types that have requests
                if (requests?.length) {
                    const sortedRequests = requests.sort((a, b) => {
                        return b.createdAt!.valueOf() - a.createdAt!.valueOf();
                    });
                    return (
                        <MatchingRequestTypeDropdown
                            key={requestType._id}
                            requestType={requestType}
                            requests={sortedRequests}
                            donationForm={props.donationForm}
                            showAssignedMatchesOnly={props.showAssignedMatchesOnly}
                            isMatching={props.isMatching}
                            isErroneous={props.isErroneous}
                            onQuantitySelected={props.onQuantitySelected}
                        />
                    );
                }
            })}
        </div>
    );
};

export default MatchingRequestTypeDropdownList;
