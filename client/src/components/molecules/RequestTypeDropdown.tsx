import { gql, useMutation } from '@apollo/client';
import React, { FunctionComponent, useState } from 'react';
import CommonModal from '../organisms/Modal';
import Dropdown from '../atoms/Dropdown';
import Request from '../../data/types/request';
import RequestGroup from '../../data/types/requestGroup';
import RequestsTable from './RequestsTable';
import RequestType from '../../data/types/requestType';

interface Props {
    key?: string;
    requestType?: RequestType;
    requestGroup?: RequestGroup;
    requests?: Request[];
}

const RequestTypeDropdown: FunctionComponent<Props> = (props: Props) => {
    const mutation = gql`
    mutation updateRequestType($requestType: RequestTypeInput){
        updateRequestType(requestType: $requestType){
          id
          success
          message
        }
      }
    `;

    const softDelete = gql`
    mutation deleteARequestType($id: ID){
        softDeleteRequestType(id: $id){
          id
          success
          message
        }
      }`;

    const [requestType, setRequestType] = useState(props.requestType);
    const [backupRequestType, setBackupRequestType] = useState(requestType);
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [isTooLong, setIsTooLong] = useState(false);
    const [mutateRequestType, {error,data}] = useMutation(mutation);
    const [mutateDeleteRequestType] = useMutation(softDelete);

    const getTotalQuantity = () => {
        let totalQuantity = 0;
        requestType?.requests!.forEach(request => {
            totalQuantity += request.quantity!
        });
        return totalQuantity;
    }

    const editModalTitle = "Edit Type";
    const deleteModalTitle = "Delete Type";
    const deleteModalSubtitle = "Are you sure you want to delete "  + requestType!.name + " as a type in the group " + props.requestGroup!.name + "? This will delete all "+ getTotalQuantity() + " requests within this type and cannot be undone."
    
    const tooLongMessage = "Type name cannot exceed 50 characters!";

    const handleEditModalClose = () => {
        setRequestType(backupRequestType);
        setIsTooLong(false);
        setEditModalShow(false)
    };
    const handleDeleteModalClose = () => setDeleteModalShow(false);

    const handleClick = async (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        // change requestType here
        console.log(requestType); 
        const id = requestType?._id;
        const name = requestType?.name;
        const deleted = requestType?.deleted;
        mutateRequestType({variables:{requestType: {id, name, deleted}}});
        if (error) console.log(error.graphQLErrors)
        setBackupRequestType(requestType);
    };

    const deleteRequestType = async () => {
        //delete requestType here
        mutateDeleteRequestType({variables:{id:requestType?._id}});

    }


    // when user clicks edit button request type
    const onOpenEditRequestType = () => {
        setEditModalShow(true);
    }

    // when user clicks delete button request type
    const onOpenDeleteRequestType = () => {
        setDeleteModalShow(true);
    }

    // user editing request type in modal
    const onEditRequestType = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 50 ){
            setIsTooLong(true);
        } else {
            setIsTooLong(false);
            const newReqType  = {...requestType, name:e.target.value};
            setRequestType(newReqType);
        }
    };

    return (
        <div className="request-type-dropdown-container">
            <Dropdown 
                title={requestType?.name ? requestType.name : ""} 
                body={<RequestsTable requests={props.requests ? props.requests : []} />}
                header={<span className="button-container">
                    <a className="button-container edit" onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {onOpenEditRequestType(); e.stopPropagation();}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg></a>
                    <a className="button-container delete" onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {onOpenDeleteRequestType(); e.stopPropagation();}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg></a>
                    </span>}
                ></Dropdown>
            <CommonModal title={editModalTitle} subtitle={""} handleClose={handleEditModalClose} show={editModalShow} body={
                <div>
                    <form onSubmit={handleClick}>
                        <div>
                            <input
                                name="requestType"
                                placeholder="Edit Type"
                                type="text"
                                value={requestType?.name}
                                className="input-field"
                                onChange={onEditRequestType}
                            />
                        </div>
                        {isTooLong && 
                        <div className="too-long-container">
                            <h4 className="too-long-text">{tooLongMessage}</h4>
                        </div>
                        }
                        <button role="link" className="button" >
                            Save Changes
                        </button>
                    </form>
                </div>
            }/>
            <CommonModal title={deleteModalTitle} subtitle={deleteModalSubtitle} handleClose={handleDeleteModalClose} show={deleteModalShow} body={
                <div>
                    <form onSubmit={deleteRequestType}>
                        <button role="link" className="button">
                            Confirm
                        </button>
                    </form>
                </div>
            }/>
            
          
        </div>
    )
}

export default RequestTypeDropdown;
