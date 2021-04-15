import { gql, useMutation } from '@apollo/client';
import React, { FunctionComponent, useState } from 'react';
import CommonModal from '../organisms/Modal';
import Dropdown from '../atoms/Dropdown';
import FormModal from '../organisms/FormModal';
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
    const [mutateRequestType, { error }] = useMutation(mutation);
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
    const tooLongMessage = "Type name cannot exceed 40 characters!";

    const handleEditModalClose = () => {
        setRequestType(backupRequestType);
        setIsTooLong(false);
        setEditModalShow(false)
    };
    const handleDeleteModalClose = () => setDeleteModalShow(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        // change requestType here
        const id = requestType?._id;
        const name = requestType?.name;
        const deleted = requestType?.deleted;
        mutateRequestType({variables:{requestType: {id, name, deleted}}});
        if (error) console.log(error.graphQLErrors)
        setBackupRequestType(requestType);
        setEditModalShow(false);
    };

    const deleteRequestType = async () => {
        //delete requestType here
        mutateDeleteRequestType({variables:{id:requestType?._id}});
        setDeleteModalShow(false);
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
        if (e.target.value.length > 40 ){
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
                title={requestType?.name ? requestType.name.toUpperCase() + " (" + props.requests?.length + ")" : ""} 
                header={<span className="button-container">
                    <a className="button-container edit" onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {onOpenEditRequestType(); e.stopPropagation();}}><i className="bi bi-pencil"></i></a>
                    <a className="button-container delete" onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {onOpenDeleteRequestType(); e.stopPropagation();}}><i className="bi bi-trash"></i></a>
                    </span>}
                body={<RequestsTable requests={props.requests ? props.requests : []} />}
                ></Dropdown>
            {/*TODO: add edit request type and delete requesty type modals here */}
            <CommonModal title={editModalTitle} subtitle={""} handleClose={handleEditModalClose} show={editModalShow} body={
                <div>
                    <form onSubmit={handleSubmit}>
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
            <FormModal 
                class="request-type-form-modal"
                title={deleteModalTitle}
                handleClose={handleDeleteModalClose}
                show={deleteModalShow}
                size="small">
                    <div className="request-type-form-modal-contents">
                        <p>Are you sure you want to delete <b>&#34;{requestType!.name}&#34;</b> as a type in the group <b>&#34;{props.requestGroup!.name}&#34;</b>? This will delete all <b>{getTotalQuantity()}</b> requests within this type and cannot be undone.</p>
                    </div>
                    <div className="request-group-form-modal-footer">
                        <button className="request-type-form-modal-confirm" onClick={() => {
                            deleteRequestType()
                            window.location.reload()
                        }
                        }>Confirm</button>
                        <button className="request-type-form-modal-cancel" onClick={() => setDeleteModalShow(false)}>Cancel</button>
                    </div>
            </FormModal>
        </div>
    )
}

export default RequestTypeDropdown;
