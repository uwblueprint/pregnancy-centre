import React, { FunctionComponent } from 'react';
import { ListGroup } from 'react-bootstrap';

import RequestType from '../../data/types/requestType';

interface Props {
    requestType: RequestType
}

const RequestTypeListItem: FunctionComponent<Props> = (props: Props) => {
    return (
        <ListGroup.Item className="request-type-list-item">
            <span id="name">
                {props.requestType.name}
            </span>
            <span id="numOpen">
                <b>{props.requestType.numOpen} </b> 
                {props.requestType.numOpen === 1 ? 'Request' : 'Requests'}
            </span>
        </ListGroup.Item>
    )
}

export default RequestTypeListItem;
