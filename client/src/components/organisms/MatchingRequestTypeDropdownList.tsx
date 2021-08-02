import React, { FunctionComponent } from "react";
import { DonationForm } from "../../data/types/donationForm";
import MatchingRequestTypeDropdown from "../molecules/MatchingRequestTypeDropdown";
import RequestType from "../../data/types/requestType";

interface Props {
    requestTypes: RequestType[];
    donationForm: DonationForm;
    isMatching: boolean;
    isErroneous: boolean;
    onQuantitySelected: (newQuantity: number, requestId: string) => void;
}

const MatchingRequestTypeDropdownList: FunctionComponent<Props> = (props: Props) => {
    const undeletedRequestTypes = props.requestTypes.filter((requestType) => requestType.deleted === false);
    return (
        <div className="donation-matching-dropdown-list">
            {undeletedRequestTypes.map((requestType) => (
                <MatchingRequestTypeDropdown
                    key={requestType._id}
                    requestType={requestType}
                    requests={requestType.openRequests ?? []}
                    donationForm={props.donationForm}
                    isMatching={props.isMatching}
                    isErroneous={props.isErroneous}
                    onQuantitySelected={props.onQuantitySelected}
                />
            ))}
        </div>
    );
};

export default MatchingRequestTypeDropdownList;
