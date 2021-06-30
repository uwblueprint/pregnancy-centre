import { gql, useMutation } from '@apollo/client';
import React, { FunctionComponent, useEffect,  useState } from 'react';
import  Form  from 'react-bootstrap/Form';
import moment from 'moment';
import Request from '../../data/types/request';
import RequestForm from "../organisms/RequestForm";
import  Table  from 'react-bootstrap/Table';

interface Props {
    requests: Request[];
    onChangeNumRequests?: (num : number) => void;
}

const ClientRequestTable: FunctionComponent<Props> = (props: Props) => {
    const [ requestSelectedForEditing, setRequestSelectedForEditing ] = useState("");
    const headingList = ['Fulfilled', 'Request Group', 'Request Type', 'Quantity', 'Date Requested', ''];
    const [requests, setRequests] = useState<Request[]>([]);
    
    const updateRequest = gql` 
    mutation updateRequest($request: RequestInput){
        updateRequest(request: $request){
          id
          success
          message
        }
      }
    `;

    const softDeleteRequest = gql`
    mutation deleteRequest($id: ID) {
        softDeleteRequest(id: $id) {
            id
            success
            message
        }
    }`
    
    function orderRequests(undeletedReq : Request[]) {
        const filterByFulfilled = (requests : Request[], keepFulfilled : boolean) => {
            requests = requests.filter( request => {
                    if (request !== undefined){
                        if (request.fulfilled === keepFulfilled){
                            return request;
                        }
                    }
                }
            );
            return requests;
        }
        const unfulfilledReq = filterByFulfilled(undeletedReq, false);
        const fulfilledRequests = filterByFulfilled(undeletedReq, true);

        const compareDateCreated = (a : Request, b : Request) => {
            return (a!.dateCreated!.valueOf() - b!.dateCreated!.valueOf()); 
        }
        unfulfilledReq.sort(compareDateCreated);
        fulfilledRequests.sort(compareDateCreated);
    
        const sortedRequests : Request[] = unfulfilledReq!.concat(fulfilledRequests!) as Request[];
        setRequests(sortedRequests);
        props.onChangeNumRequests!(sortedRequests.length);
    }

    useEffect(() => {
        const undeletedReq : Request[] = props.requests.filter((request)=> request.deleted === false);
        orderRequests(undeletedReq);
      }, [props.requests]);
      

    const [mutateDeleteRequest] = useMutation(softDeleteRequest);
    const [mutateRequest] = useMutation(updateRequest);
    const onSoftDeleteRequest = (index: number) => {
        const requestsCopy = requests.slice();
        requestsCopy.splice(index, 1);
        const id = requestsCopy[index]._id;
        props.onChangeNumRequests!(requestsCopy.length);
        setRequests(requestsCopy);
        mutateDeleteRequest({variables: {id: id}});
    }

    const onFulfilledRequest = (index: number) => {
        requests[index].fulfilled = !requests[index].fulfilled;
        orderRequests(requests);
        const id = requests[index]._id;
        const requestId = requests[index].requestId;
        const fulfilled = requests[index].fulfilled;
        mutateRequest({variables:{request: {id, requestId, fulfilled}}});
    }


    return (
        <div className="client-request-table">
            { requestSelectedForEditing && <RequestForm onSubmitComplete={() => { window.location.reload() }} handleClose={() => setRequestSelectedForEditing("")} operation="edit" requestId={requestSelectedForEditing} /> }
            {requests.length !== 0 &&
                <Table responsive className="request-table"> 
                <thead> 
                <tr>
                    {headingList.map((heading, index) => (
                    <th key={index} className="request-table th">{heading}</th>
                    ))}
                </tr>
                </thead>
                <tbody> 
                    {requests.map((request, index)=> ( 
                        request.deleted === false ?
                        <tr key={request._id}>
                            <td>
                                <div><Form.Check type="checkbox" onClick={() => onFulfilledRequest(index)} defaultChecked={request.fulfilled}/></div>
                            </td>
                            {request?.requestType?.requestGroup != null ?
                                <td style={request.fulfilled ? {opacity: 0.2}:undefined}><div className="row-text-style">{request.requestType.requestGroup.name}</div></td>
                                : <td>N/A</td>
                            }
                            {request.requestType != null ?
                                <td style={requests[index].fulfilled ? {opacity: 0.2}:undefined}><div className="row-text-style">{request.requestType.name}</div></td>
                                : <td>N/A</td>
                            }
                            <td style={request.fulfilled ? {opacity: 0.2}:undefined}>{request.quantity}</td>
                            <td style={request.fulfilled ? {opacity: 0.2}:undefined}>{
                                moment(request.dateCreated, "x").format('MMMM DD, YYYY')
                            }</td>
                            <td><div className="btn-cont">
                                <td><a className="request-table edit" onClick={() => { if(request._id) { setRequestSelectedForEditing(request._id) }}}><i className="bi bi-pencil"></i></a></td>
                                <td><a className="request-table delete" onClick={() => onSoftDeleteRequest(index)}><i className="bi bi-trash"></i></a></td>
                                </div>
                            </td>
                        </tr> : undefined
                    ))}
                </tbody>
            </Table>}
        </div>
    )
}

export default ClientRequestTable;
