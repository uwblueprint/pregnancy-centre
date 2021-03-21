import React, { FunctionComponent } from 'react';
import RequestTypeDropdown from '../molecules/RequestTypeDropdown';

interface Props {
    requestTypes: any[];
}

const RequestTypeDropdownList: FunctionComponent<Props> = (props: Props) => {
    return (
        <div>
             {props.requestTypes.map((requestType) => <RequestTypeDropdown key={requestType} requestType={requestType}/>)}
             <RequestTypeDropdown requestType="400 ML"></RequestTypeDropdown>
        </div>
    )
}

export default RequestTypeDropdownList;