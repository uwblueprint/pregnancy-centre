import React, { FunctionComponent } from "react";
import { ListGroup } from "react-bootstrap";

import RequestType from "../../data/types/requestType";
import RequestTypeListItem from "../atoms/RequestTypeListItem";

interface Props {
    requestTypes: RequestType[];
}

const RequestTypeList: FunctionComponent<Props> = (props: Props) => {
    return (
        <div className="request-type-list">
            <h1>TYPES</h1>
            <ListGroup className="request-type-list" variant="flush">
                {props.requestTypes
                    .sort((requestType1: RequestType, requestType2: RequestType) =>
                        (requestType1.name ? requestType1.name : "") > (requestType2.name ? requestType2.name : "")
                            ? 1
                            : -1
                    )
                    .map((requestType) => (
                        <RequestTypeListItem key={requestType._id} requestType={requestType} />
                    ))}
            </ListGroup>
        </div>
    );
};

export default RequestTypeList;
