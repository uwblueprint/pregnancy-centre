import { gql, useMutation } from '@apollo/client';
import React, { FunctionComponent, useEffect,  useState } from 'react';
import  Form  from 'react-bootstrap/Form';
import moment from 'moment';
import Request from '../../data/types/request'; // this is an interface 
import RequestForm from "../organisms/RequestForm";
import  Table  from 'react-bootstrap/Table';

interface Props {
    requests: Request[];
    onChangeNumRequests?: (num : number) => void;
}

const ClientRequestTable: FunctionComponent<Props> = (props: Props) => {
    const [ requestSelectedForEditing, setRequestSelectedForEditing ] = useState("");
    const headingList = ['Fulfilled', 'Request Group', 'Request Type', 'Quantity', 'Date Requested', ''];
    
    // CONFUSIONNNN
    const updateRequest = gql` 
    mutation updateRequest($request: RequestInput){
        updateRequest(request: $request){
          id
          success
          message
        }
      }
    `;

    // CONFUSIONNNN
    const softDeleteRequest = gql`
    mutation deleteRequest($id: ID) {
        softDeleteRequest(id: $id) {
            id
            success
            message
        }
    }`


    const [requests, setRequests] = useState(props.requests.filter((request)=> request.deleted === false)); // our REAL list of requests stored in state
    
    useEffect(() => { // not sure what the role of useEffect is hereee
        const nonFulfilledRequests = requests.filter(request => { // returns all of the unfulfilled reqs
            if (request !== undefined){
                if (request.fulfilled === false){
                    return request;
                }
            }
        });
        const fulfilledRequests = requests.filter(request => { // returns all of the fulfilled reqs
            if (request !== undefined){
                if (request.fulfilled === true){
                    return request;
                }
            }
        });
        
        nonFulfilledRequests.sort((a, b)=> { // sorts the unfulfilled reqs by date, if returns a value > than 0, sort b before a
            return (a!.dateCreated!.valueOf() - b!.dateCreated!.valueOf()); // exclamation mark screams that the value will not be null/undefined
        });
            
    
        fulfilledRequests.sort((a, b)=> { // sorts the fulfilled reqs by date
            return (a!.dateCreated!.valueOf() - b!.dateCreated!.valueOf());
        });
     
    
        const sortedRequests : Request[] = nonFulfilledRequests!.concat(fulfilledRequests!) as Request[]; // .concat joins the two arrays
        setRequests(sortedRequests); // updating state of requests to store only the non-deleted, sorted list of requests
      }, []);
      
    // confusion 🤩🤩🤩
    const [mutateDeleteRequest] = useMutation(softDeleteRequest)   
    const [mutateRequest] = useMutation(updateRequest);
    const onSoftDeleteRequest = (index: number) => {
        const requestsCopy = requests.slice()
        const req = {...requestsCopy[index]}
        requestsCopy.splice(index, 1)
        const id = req._id
        props.onChangeNumRequests!(requestsCopy.length)
        setRequests(requestsCopy)
        mutateDeleteRequest({variables: {id: id}})
    }

    // confusion 🤩🤩🤩
    const onFulfilledRequest = (index: number) => {
        const requestsCopy = requests.slice();
        const req = {...requestsCopy[index]};
        if(req.fulfilled === false) {
            req.fulfilled = true
            requestsCopy.splice(index, 1)
            let i = requestsCopy.length - 1;
            for(; i > -1; --i) {
                if(requestsCopy[i].fulfilled === false) break
                else if(requestsCopy[i]!.dateCreated!.valueOf() < req!.dateCreated!.valueOf()) break
            }
            requestsCopy.splice(i + 1, 0, req)
        }
        else {
            req.fulfilled = false;
            requestsCopy.splice(index, 1)
            let i = 0
            for(; i < requestsCopy.length; ++i) {
                if(requestsCopy[i].fulfilled === true) break
                else if(requestsCopy[i]!.dateCreated!.valueOf() > req!.dateCreated!.valueOf()) break
            }
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
            {/* if a request is being selected for editing, open form, then reload the page when they save the form */ }
            { requestSelectedForEditing && <RequestForm onSubmitComplete={() => { window.location.reload() }} handleClose={() => setRequestSelectedForEditing("")} operation="edit" requestId={requestSelectedForEditing} /> }
            {props.onChangeNumRequests && // if number of requests > 0, load our requests table
                <Table responsive className="request-table"> 
                <thead> 
                <tr > {/** setting headers of table by mapping through our list of headers earlier, auto generates an index if given that field */}
                    {headingList.map((heading, index) => (
                    <th key={index} className="request-table th">{heading}</th>
                    ))}
                </tr>
                </thead>
                <tbody> 
                    {requests.map((request, index)=> ( 
                        request.deleted === false ?
                        <tr key={request._id} > {/**setting unique key for each child of tbody*/}
                            <td>
                            <div>
                                <Form.Check type="checkbox" onClick={() => onFulfilledRequest(index)} defaultChecked={request.fulfilled}/>
                            </div>
                            </td>
                            {request?.requestType?.requestGroup !== null ?
                                <td style={requests[index].fulfilled ? {opacity: 0.2}:undefined}><div className="row-text-style">{request?.requestType?.requestGroup}</div></td>:
                                <td>N/A</td>
                            }
                            {request.requestType !== null ?
                                <td style={requests[index].fulfilled ? {opacity: 0.2}:undefined}><div className="row-text-style">{request.requestType}</div></td>:
                                <td>N/A</td>
                            }
                            <td style={requests[index].fulfilled ? {opacity: 0.2}:undefined}>{request.quantity}</td>
                            <td style={requests[index].fulfilled ? {opacity: 0.2}:undefined}>{
                                moment(request.dateCreated, "x").format('MMMM DD, YYYY')
                            }</td>
                            <td><div className="btn-cont">
                                <td><a className="request-table edit" onClick={() => { if(request._id) { setRequestSelectedForEditing(request._id) }}}><i className="bi bi-pencil"></i></a></td>
                                <td><a className="request-table delete" onClick={() => onSoftDeleteRequest(index)}><i className="bi bi-trash"></i></a></td>
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

export default ClientRequestTable;
