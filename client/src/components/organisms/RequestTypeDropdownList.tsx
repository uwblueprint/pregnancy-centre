import React, { FunctionComponent } from 'react';
import Dropdown from '../atoms/Dropdown';
import RequestType from '../../data/types/requestType';
import RequestTypeDropdown from '../molecules/RequestTypeDropdown';

interface Props {
    requestTypes?: RequestType[];
}

const RequestTypeDropdownList: FunctionComponent<Props> = (props: Props) => {
    const dummyRequests1 = [{"_id": "605570e1acc03342432432","fulfilled": false,"client": {"firstName": "Anand",
    "lastName": "Issac"},"dateCreated": "1590740228592"}, {"_id": "605570e1acc0254a485adfadf","fulfilled": false,"client": {"firstName": "Zach","lastName": "Lavine"},"dateCreated": "1564965009667"}];
    const dummyRequests2 = [{"_id": "605570e1acc023424235e44c4","fulfilled": false,"client": {"firstName": "Michael",
    "lastName": "Scott"},"dateCreated": "1590740228592"}, {"_id": "605570e1acc0254a485e44c6","fulfilled": false,"client": {"firstName": "Salmon","lastName": "Oil"},"dateCreated": "1564965009667"},{"_id": "605570e1acc0254a485e44c6","fulfilled": false,"client": {"firstName": "Justin","lastName": "Trudeau"},"dateCreated": "1564965009667"}, {"_id": "605570e1acc0254a485e44c6","fulfilled": false,"client": {"firstName": "Feridun","lastName": "Halkjdfkl"},"dateCreated": "1564965009667"}];
    const dummyRequests3 = [{"_id": "605570e1acc0254a485e343da4","fulfilled": false,"client": {"firstName": "George",
    "lastName": "Martin"},"dateCreated": "1590740228592"}, {"_id": "605570e1acc0254a485e44c6","fulfilled": false,"client": {"firstName": "Emmie","lastName": "Bernier"},"dateCreated": "1564965009667"}];

    console.log(props.requestTypes); 
    return (
        <div className="request-type-dropdown-list">
            { props.requestTypes ? props.requestTypes.map(requestType => 
                <RequestTypeDropdown key={requestType._id} requestType={requestType.name} requests={requestType.requests} />
            ) : []}
        </div>
    )
}

export default RequestTypeDropdownList;
