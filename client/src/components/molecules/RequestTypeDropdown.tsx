import React, { FunctionComponent } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaPen } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';
import  Form  from 'react-bootstrap/Form';
import  Table  from 'react-bootstrap/Table';

import Request from '../../data/types/request';
import RequestsTable from './RequestsTable';

interface Props {
    requestType: any;
}

const RequestTypeDropdown: FunctionComponent<Props> = (props: Props) => {
    const dummyRequests = [{"_id": "605570e1acc0254a485e44c4","fulfilled": false,"client": {"firstName": "Willie",
    "lastName": "Franecki"},"dateCreated": "1590740228592"}, {"_id": "605570e1acc0254a485e44c6","fulfilled": false,"client": {"firstName": "Emmie","lastName": "Bernier"},"dateCreated": "1564965009667"}];
    return (
        <div className="request-type-dropdown-container">
            <Dropdown >
                <Dropdown.Toggle className="request-type-dropdown" id="dropdown-basic">
                    {props.requestType}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.ItemText><RequestsTable requests={dummyRequests} /></Dropdown.ItemText>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default RequestTypeDropdown;