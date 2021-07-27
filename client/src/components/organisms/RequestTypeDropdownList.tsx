import React, { FunctionComponent } from "react";
import RequestGroup from "../../data/types/requestGroup";
import RequestType from "../../data/types/requestType";
import RequestTypeDropdown from "../molecules/RequestTypeDropdown";

interface Props {
    requestTypes: RequestType[];
    requestGroup: RequestGroup;
}

const RequestTypeDropdownList: FunctionComponent<Props> = (props: Props) => {
    const undeletedRequestTypes = props.requestTypes.filter((requestType) => requestType.deleted === false);
    return (
        <div className="request-type-dropdown-list">
            {undeletedRequestTypes.map((requestType) => (
                <RequestTypeDropdown
                    key={requestType._id}
                    requestGroup={props.requestGroup}
                    requestType={requestType}
                    requests={requestType.requests}
                    deletable={undeletedRequestTypes.length > 1}
                />
            ))}
        </div>
    );
};

export default RequestTypeDropdownList;
