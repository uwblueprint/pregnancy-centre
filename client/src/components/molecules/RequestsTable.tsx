import { gql, useMutation } from '@apollo/client';
import React, { FunctionComponent,  useEffect,  useState } from 'react';
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
    
    useEffect(() => {
        // Your code here
        const nonFulfilledRequests = requests.filter(request => {
            if (request !== undefined){
                if (request.fulfilled === false){
                    return request;
                }
            }
        });
        const fulfilledRequests = requests.filter(request => {
            if (request !== undefined){
                if (request.fulfilled === true){
                    return request;
                }
            }
        });
        
        nonFulfilledRequests.sort((a, b)=> {
            return (a!.dateCreated!.valueOf() - b!.dateCreated!.valueOf());
        });
            
    
        fulfilledRequests.sort((a, b)=> {
            return (a!.dateCreated!.valueOf() - b!.dateCreated!.valueOf());
        });
     
    
        const sortedRequests : Request[] = nonFulfilledRequests!.concat(fulfilledRequests!) as Request[];
        setRequests(sortedRequests);
      }, []);
      
     //console.log(sortedRequests);

    const [mutateRequest] = useMutation(updateRequest);
    const onFulfilledRequest = (index: number) => {
        const requestsCopy = requests.slice();
        const req = {...requestsCopy[index]};
        if(req.fulfilled === false) {
            req.fulfilled = true
            requestsCopy.splice(index, 1)
            requestsCopy.push(req)
        }
        else {
            req.fulfilled = false;
            requestsCopy.splice(index, 1)
            let i = 0
            for(; i < requestsCopy.length; ++i) if(requestsCopy[i].fulfilled === true) break
            requestsCopy.splice(i, 0, req)
        }
        setRequests(requestsCopy);
        const id = req._id;
        const requestId = req.requestId;
        const fulfilled = req.fulfilled;
        mutateRequest({variables:{request: {id, requestId, fulfilled}}});
    }

    return (
        <div className="request-list">
            { requests.length === 0 ? <p className="request-table-empty-message">There are currently no requests in this type</p> : 
            <Table responsive className="request-table">
                <thead>
                <tr >
                    {headingList.map((heading, index) => (
                    <th key={index} className="request-table th">{heading}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                    {requests.map((request, index)=> (
                        request.deleted === false ?
                        <tr key={request._id} >
                            <td>
                            <div >
                                <Form.Check type="checkbox" onClick={() => onFulfilledRequest(index)} defaultChecked={request.fulfilled}/>
                            </div>
                            </td>
                            {request.client !== null ?
                                <td style={requests[index].fulfilled ? {opacity: 0.2}:undefined}><div className="row-text-style">{request.client!.fullName}</div></td>:
                                <td>N/A</td>
                            }
                            <td style={requests[index].fulfilled ? {opacity: 0.2}:undefined}>{request.quantity}</td>
                            <td style={requests[index].fulfilled ? {opacity: 0.2}:undefined}>{
                                moment(request.dateCreated, "x").format('MMMM DD, YYYY')
                            }</td>
                            <td><div className="btn-cont">
                                <td><a className="request-table edit" href="/"><i className="bi bi-pencil"></i></a></td>
                                <td><a className="request-table delete" href="/"><i className="bi bi-trash"></i></a></td>
                            </div></td>
                        </tr> : undefined
                    ))}
                </tbody>
            </Table>
            }

            {/* TODO: Add Edit and Delete Request Modals here*/}
        </div>
    )
}

export default RequestsTable;
