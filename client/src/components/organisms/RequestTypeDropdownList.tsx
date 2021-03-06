import React, { FunctionComponent } from "react";
import RequestGroup from "../../data/types/requestGroup";
import RequestType from "../../data/types/requestType";
import RequestTypeDropdown from "../molecules/RequestTypeDropdown";

interface Props {
    requestTypes?: RequestType[];
    requestGroup?: RequestGroup;
}

const RequestTypeDropdownList: FunctionComponent<Props> = (props: Props) => {
    return (
        <div className="request-type-dropdown-list">
            {props.requestTypes
                ? props.requestTypes.map((requestType) => {
                      if (requestType.deleted === false) {
                          return (
                              <RequestTypeDropdown
                                  key={requestType._id}
                                  requestGroup={props.requestGroup}
                                  requestType={requestType}
                                  requests={requestType.requests}
                              />
                          );
                      }
                  })
                : []}
        </div>
    );
};

export default RequestTypeDropdownList;
