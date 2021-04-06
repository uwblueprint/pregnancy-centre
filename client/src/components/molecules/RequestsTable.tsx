import { gql, useMutation } from '@apollo/client';
import React, { FunctionComponent,  useState } from 'react';
import  Form  from 'react-bootstrap/Form';
import moment from 'moment';
import  Table  from 'react-bootstrap/Table';

import Request from '../../data/types/request';

interface Props {
    requests: Request[];
}

const RequestsTable: FunctionComponent<Props> = (props: Props) => {
    const headingList = ['Fulfilled', 'Client Name', 'Quantity', 'Date Requested', ''];
    const updateRequest = gql`
    mutation updateRequest($request: RequestInput){
        updateRequest(request: $request){
          id
          success
          message
        }
      }
    `;

    const [requests, setRequests] = useState(props.requests);
    const [mutateRequest] = useMutation(updateRequest);
    const onFulfilledRequest = (index: number) => {
        const requestsCopy = requests.slice();
        const req = {...requestsCopy[index]};
        req.fulfilled = !req.fulfilled;
        requestsCopy[index]=req
        setRequests(requestsCopy);
        const id = req._id;
        const requestId = req.requestId;
        const fulfilled = req.fulfilled;
        mutateRequest({variables:{request: {id, requestId, fulfilled}}});
    }

    return (
        <div className="request-list">
            <Table responsive className="request-table">
                <thead>
                <tr className="request-table header-style">
                    {headingList.map((heading, index) => (
                    <th key={index} className="request-table th">{heading}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                    {props.requests.map((request, index)=> (
                        <tr key={request._id} className="request-table row-style">
                            <td>
                            <div >
                                <Form.Check type="checkbox" onClick={() => onFulfilledRequest(index)} defaultChecked={request.fulfilled}/>
                            </div>
                            </td>
                            <td style={requests[index].fulfilled ? {opacity: 0.2}:undefined}><div className="row-text-style">{request.client!.fullName}</div></td>
                            <td style={requests[index].fulfilled ? {opacity: 0.2}:undefined}>{request.quantity}</td>
                            <td style={requests[index].fulfilled ? {opacity: 0.2}:undefined}>{
                                moment(request.dateCreated, "x").format('MMMM DD, YYYY')
                            }</td>
                            <td><div className="btn-cont">
                                <td><a className="request-table edit" href="/"><i className="bi bi-pencil"></i></a></td>
                                <td><a className="request-table delete" href="/"><i className="bi bi-trash"></i></a></td>
                            </div></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* TODO: Add Edit and Delete Request Modals here*/}
        </div>
    )
}

export default RequestsTable;
