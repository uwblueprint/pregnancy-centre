import React, { FunctionComponent } from "react";
import RequestGroup from "../../data/types/requestGroup";
import RequestType from "../../data/types/requestType";
import RequestTypeDropdown from "../molecules/RequestTypeDropdown";

interface Props {
    requestTypes: RequestType[];
    requestGroup: RequestGroup;
    changeRequest: (num: number) => void;
}

const RequestTypeDropdownList: FunctionComponent<Props> = (props: Props) => {
    return (
        <div className="request-type-dropdown-list">
            {props.requestTypes.map((requestType) => (
                <RequestTypeDropdown
                    key={requestType._id}
                    requestGroup={props.requestGroup}
                    requestType={requestType}
                    requests={requestType.requests}
                    deletable={props.requestTypes.length > 1}
                    changeRequest={props.changeRequest}
                />
            ))}
        </div>
    );
};

export default RequestTypeDropdownList;
