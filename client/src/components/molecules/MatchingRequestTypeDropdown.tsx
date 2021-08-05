import React, { FunctionComponent, useEffect, useState } from "react";

import { DonationForm } from "../../data/types/donationForm";
import DonationMatchingRequestsTable from "./DonationMatchingRequestsTable";
import Dropdown from "../atoms/Dropdown";
import Request from "../../data/types/request";
import RequestType from "../../data/types/requestType";

interface Props {
    requestType?: RequestType;
    requests: Request[];
    donationForm: DonationForm;
    isMatching: boolean;
    isErroneous: boolean;
    onQuantitySelected: (newQuantity: number, request: Request) => void;
}

const MatchingRequestTypeDropdown: FunctionComponent<Props> = (props: Props) => {
    const requestType = props.requestType;
    const [numRequests, setNumRequests] = useState(0);
    useEffect(() => {
        setNumRequests(props.requests.reduce((total, request) => (!request.deleted ? total + 1 : total), 0));
    }, []);

    return (
        <div className="matching-request-type-dropdown-container">
            <Dropdown
                title={requestType?.name ? requestType.name.toUpperCase() + " (" + numRequests + ")" : ""}
                body={
                    <DonationMatchingRequestsTable
                        requests={props.requests}
                        donationForm={props.donationForm}
                        isMatching={props.isMatching}
                        isErroneous={props.isErroneous}
                        onQuantitySelected={props.onQuantitySelected}
                    />
                }
            ></Dropdown>
        </div>
    );
};

export default MatchingRequestTypeDropdown;
