import React, { FunctionComponent } from 'react';
import { Button } from 'react-bootstrap';
import { FaPen } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';
import  Form  from 'react-bootstrap/Form';
import moment from 'moment';
import Request from '../../data/types/request';
import  Table  from 'react-bootstrap/Table';


interface Props {
    requests: Request[]
}

const RequestsTable: FunctionComponent<Props> = (props: Props) => {
    const headingList = ['Fulfilled', 'Client Name', 'Quantity', 'Date Requested', '', ''];
    const dummyRequests = [{"_id": "605570e1acc0254a485e44c4","fulfilled": false,"client": {"firstName": "Willie",
    "lastName": "Franecki"},"dateCreated": "1590740228592"}, {"_id": "605570e1acc0254a485e44c6","fulfilled": false,"client": {"firstName": "Emmie","lastName": "Bernier"},"dateCreated": "1564965009667"}];
    return (
        <div className="request-list">
            <Table responsive className="request-table">
                <thead>
                <tr className="request-table header-style">
                    {headingList.map((heading, index) => (
                    <th key={index}>{heading}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                    {props.requests.map((request)=> (
                        <tr key={request._id} className="request-table row-style">
                            <td>
                            <div >
                                <Form.Check type="checkbox" />
                            </div>
                            </td>
                            <td>{request.client!.fullName}</td>
                            <td>{request.quantity}</td>
                            <td>{
                                // (new Date(1616993731)).toDateString()  this works!? but dates from seeder dont
                                moment(request.dateCreated, "x").format('MMMM DD, YYYY')
                            }</td>
                            <div className="btn-cont">
                                <td><a className="request-table edit" href="/"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                </svg></a></td>
                                <td><a className="request-table delete" href="/"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                </svg></a></td>
                            </div>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default RequestsTable;
