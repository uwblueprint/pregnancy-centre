import React, { FunctionComponent } from 'react';
import { Button } from 'react-bootstrap';
import { FaPen } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';
import  Form  from 'react-bootstrap/Form';
import  Table  from 'react-bootstrap/Table';

import Request from '../../data/types/request';


interface Props {
    requests: any[]
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
                    {dummyRequests.map((request, index)=> (
                        <tr key={index} className="request-table row-style">
                            <td key={index}>
                            <div >
                                <Form.Check type="checkbox" />
                            </div>
                            </td>
                            <td key={index}>{request.client.firstName +" "+ request.client.lastName}</td>
                            <td key={index}>{5}</td>
                            <td key={index}>{
                                (new Date(parseInt(request.dateCreated))).toDateString()
                            }</td>
                            <div className="btn-cont">
                                <td><a className="request-table edit" href="/"><FaPen></FaPen></a></td>
                                <td><a className="request-table delete" href="/"><FaTrashAlt></FaTrashAlt></a></td>
                            </div>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default RequestsTable;