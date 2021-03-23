import React, { FunctionComponent, useState } from 'react';
import CommonModal from '../organisms/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaPen } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';
import RequestsTable from './RequestsTable';

interface Props {
    requestType: any;
}

const RequestTypeDropdown: FunctionComponent<Props> = (props: Props) => {
    const [requestType, setRequestType] = useState(props.requestType);
    const [backupRequestType, setBackupRequestType] = useState(requestType);
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [isTooLong, setIsTooLong] = useState(false);

    const dummyRequests = [{"_id": "605570e1acc0254a485e44c4","fulfilled": false,"client": {"firstName": "Willie",
    "lastName": "Franecki"},"dateCreated": "1590740228592"}, {"_id": "605570e1acc0254a485e44c6","fulfilled": false,"client": {"firstName": "Emmie","lastName": "Bernier"},"dateCreated": "1564965009667"}];
    
    const editModalTitle = "Edit Type";
    const deleteModalTitle = "Delete Type";
    const deleteModalSubtitle = "Are you sure you want to delete “250 ML” as a type in the group “Bottles”? This will delete all 20 requests within this type and cannot be undone."
    
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
        setBackupRequestType(requestType);
    };

    const deleteRequestType = async () => {
        //delete requestType here
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
        const newRequestType = e.target.value;
        if (newRequestType.length > 50 ){
            setIsTooLong(true);
        } else {
            setIsTooLong(false);
            setRequestType(e.target.value);
        }
    };

    return (
        <div className="request-type-dropdown-container">
            <Dropdown >
                <Dropdown.Toggle className="request-type-dropdown" id="dropdown-basic">
                    <div className="type-text">
                        {requestType}
                    </div>
                    <span className="button-container">
                        <a className="button-container edit" onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {onOpenEditRequestType(); e.stopPropagation();}}><FaPen/></a>
                        <a className="button-container delete" onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {onOpenDeleteRequestType(); e.stopPropagation();}}><FaTrashAlt/></a>
                    </span>
                </Dropdown.Toggle>
                
                <Dropdown.Menu>
                    <Dropdown.ItemText><RequestsTable requests={dummyRequests} /></Dropdown.ItemText>
                </Dropdown.Menu>
            </Dropdown>
            <CommonModal title={editModalTitle} subtitle={""} handleClose={handleEditModalClose} show={editModalShow} body={
                <div>
                    <form onSubmit={handleClick}>
                        <div>
                            <input
                                name="requestType"
                                placeholder="Edit Type"
                                type="text"
                                value={requestType}
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
                    <button role="link" className="button" onClick={deleteRequestType}>
                        Confirm
                    </button>
                </div>
            }/>
            
          
        </div>
    )
}

export default RequestTypeDropdown;