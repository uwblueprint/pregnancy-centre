import { gql, useMutation } from '@apollo/client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import Dropdown from '../atoms/Dropdown';
import FormModal from '../organisms/FormModal';
import Request from '../../data/types/request';
import RequestGroup from '../../data/types/requestGroup';
import RequestsTable from './RequestsTable';
import RequestType from '../../data/types/requestType';
import RequestTypeForm from '../organisms/RequestTypeForm'


interface Props {
    key?: string;
    requestType?: RequestType;
    requestGroup?: RequestGroup;
    requests?: Request[];
}

const RequestTypeDropdown: FunctionComponent<Props> = (props: Props) => {
    const [numRequests, setNumRequests] = useState(0)

    const softDelete = gql`
    mutation deleteRequestType($_id: ID){
        deleteRequestType(_id: $_id){
            _id
        }
      }`;

    const [requestType, setRequestType] = useState(props.requestType);
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [mutateDeleteRequestType] = useMutation(softDelete);

    const getTotalQuantity = () => {
        let totalQuantity = 0;
        requestType?.requests!.forEach(request => {
            totalQuantity += request.quantity!
        });
        return totalQuantity;
    }

    const onEditModalSubmit = (newRequestTypeName: string) => {
        if (requestType) {
            const requestTypeCopy = requestType
            requestTypeCopy.name = newRequestTypeName
            setRequestType(requestTypeCopy)
        }

        setEditModalShow(false)
    };
    const handleDeleteModalClose = () => setDeleteModalShow(false);

    const deleteRequestType = async () => {
        //delete requestType here
        mutateDeleteRequestType({ variables: { id: requestType?._id } });
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

    useEffect(() => {
        setNumRequests(props.requests!.reduce((total, request) => (request.deleted === false ? total + 1 : total), 0))
    }, [])

    const handleChangeNumRequests = (num: number) => {
        setNumRequests(num)
    }
    return (
        <div className="request-type-dropdown-container">
            <Dropdown
                title={requestType?.name ? requestType.name.toUpperCase() + " (" + numRequests + ")" : ""}
                header={<span className="button-container">
                    <a className="button-container edit" onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => { onOpenEditRequestType(); e.stopPropagation(); }}><i className="bi bi-pencil"></i></a>
                    <a className="button-container delete" onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => { onOpenDeleteRequestType(); e.stopPropagation(); }}><i className="bi bi-trash"></i></a>
                </span>}
                body={<RequestsTable onChangeNumRequests={handleChangeNumRequests} requests={props.requests ? props.requests : []} />}
            ></Dropdown>
            {editModalShow && props.requestGroup && <RequestTypeForm
                handleClose={() => setEditModalShow(false)}
                onSubmit={onEditModalSubmit}
                requestType={requestType}
                requestGroup={props.requestGroup}
                operation="edit"
            />}
            <FormModal
                class="request-type-form-modal"
                title="Delete Type"
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
