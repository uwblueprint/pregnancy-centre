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
    
    useEffect(() => {
        const undeletedReq : Request[] = props.requests.filter((request)=> request.deleted === false);

        const removeUndefined = (request : Request, keepFulfilled : boolean) => {
            if (request !== undefined){
                if (request.fulfilled === keepFulfilled){
                    return request;
                }
            }
        }
        const unfulfilledReq = undeletedReq.filter(request => removeUndefined(request, false));
        const fulfilledRequests = undeletedReq.filter(request => removeUndefined(request, true));

        const compareDateCreated = (a : Request, b : Request)=> {
            return (a!.dateCreated!.valueOf() - b!.dateCreated!.valueOf()); 
        }
        unfulfilledReq.sort(compareDateCreated);
        fulfilledRequests.sort(compareDateCreated);
    
        const sortedRequests : Request[] = unfulfilledReq!.concat(fulfilledRequests!) as Request[];
        setRequests(sortedRequests);
      }, [props.requests]);
      

    const [mutateDeleteRequest] = useMutation(softDeleteRequest);
    const [mutateRequest] = useMutation(updateRequest);
    const onSoftDeleteRequest = (index: number) => {
        const requestsCopy = requests.slice();
        const req = {...requestsCopy[index]};
        requestsCopy.splice(index, 1);
        const id = req._id;
        props.onChangeNumRequests!(requestsCopy.length);
        setRequests(requestsCopy);
        mutateDeleteRequest({variables: {id: id}});
    }

    const onFulfilledRequest = (index: number) => {
        const requestsCopy = requests.slice();
        const req = {...requestsCopy[index]};
        if(req.fulfilled === false) { 
            req.fulfilled = true;
            requestsCopy.splice(index, 1) 
            let i = requestsCopy.length - 1; 
            for(; i > -1; --i) {
                if(requestsCopy[i].fulfilled === false) break;
                else if(requestsCopy[i]!.dateCreated!.valueOf() < req!.dateCreated!.valueOf()) break;
            }
            requestsCopy.splice(i + 1, 0, req);
        }
        else {
            req.fulfilled = false;
            requestsCopy.splice(index, 1);
            let i = 0;
            for(; i < requestsCopy.length; ++i) {
                if(requestsCopy[i].fulfilled === true) break;
                else if(requestsCopy[i]!.dateCreated!.valueOf() > req!.dateCreated!.valueOf()) break;
            }
            requestsCopy.splice(i, 0, req);
        }
        setRequests(requestsCopy);
        const id = req._id;
        const requestId = req.requestId;
        const fulfilled = req.fulfilled;
        mutateRequest({variables:{request: {id, requestId, fulfilled}}});
    }


    return (
        <div className="request-list">
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
