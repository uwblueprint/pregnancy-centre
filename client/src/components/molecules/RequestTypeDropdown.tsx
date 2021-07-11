import { gql, useMutation } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";

import DeleteRequestTypeDialog from "../organisms/DeleteRequestTypeDialog";
import Dropdown from "../atoms/Dropdown";
import Request from "../../data/types/request";
import RequestGroup from "../../data/types/requestGroup";
import RequestsTable from "./RequestsTable";
import RequestType from "../../data/types/requestType";
import RequestTypeForm from "../organisms/RequestTypeForm";

interface Props {
    key?: string;
    requestType?: RequestType;
    requestGroup?: RequestGroup;
    requests?: Request[];
    deletable?: boolean;
}

const RequestTypeDropdown: FunctionComponent<Props> = (props: Props) => {
    const [numRequests, setNumRequests] = useState(0);

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
        requestType?.requests!.forEach((request) => {
            if (!request.deleted) {
                totalQuantity += request.quantity!;
            }
        });
        return totalQuantity;
    };

    const onEditModalSubmit = (newRequestTypeName: string) => {
        if (requestType) {
            const requestTypeCopy = requestType;
            requestTypeCopy.name = newRequestTypeName;
            setRequestType(requestTypeCopy);
        }

        setEditModalShow(false);
    };

    const deleteRequestType = async () => {
        //delete requestType here
        mutateDeleteRequestType({ variables: { id: requestType?._id } });
        setDeleteModalShow(false);
    };

    // when user clicks edit button request type
    const onOpenEditRequestType = () => {
        setEditModalShow(true);
    };

    // when user clicks delete button request type
    const onOpenDeleteRequestType = () => {
        setDeleteModalShow(true);
    };

    useEffect(() => {
        setNumRequests(props.requests!.reduce((total, request) => (request.deleted === false ? total + 1 : total), 0));
    }, []);

    const handleChangeNumRequests = (num: number) => {
        setNumRequests(num);
    };
    return (
        <div className="request-type-dropdown-container">
            <Dropdown
                title={requestType?.name ? requestType.name.toUpperCase() + " (" + numRequests + ")" : ""}
                header={
                    props.deletable ? 
                    <span className="button-container">
                        <a
                            className="button-container edit"
                            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                                onOpenEditRequestType();
                                e.stopPropagation();
                            }}
                        >
                            <i className="bi bi-pencil"></i>
                        </a>
                    </span>
                    :
                    <span className="button-container">
                        <a
                            className="button-container edit"
                            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                                onOpenEditRequestType();
                                e.stopPropagation();
                            }}
                        >
                            <i className="bi bi-pencil"></i>
                        </a>
                        <a
                            className="button-container delete"
                            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                                onOpenDeleteRequestType();
                                e.stopPropagation();
                            }}
                        >
                            <i className="bi bi-trash"></i>
                        </a>
                    </span>
                }
                body={
                    <RequestsTable
                        onChangeNumRequests={handleChangeNumRequests}
                        requests={props.requests ? props.requests : []}
                    />
                }
            ></Dropdown>
            {editModalShow && props.requestGroup && (
                <RequestTypeForm
                    handleClose={() => setEditModalShow(false)}
                    onSubmit={onEditModalSubmit}
                    requestType={requestType}
                    requestGroup={props.requestGroup}
                    operation="edit"
                />
            )}
            {deleteModalShow && (
                <DeleteRequestTypeDialog
                    requestTypeName={requestType!.name}
                    requestGroupName={props.requestGroup!.name}
                    handleClose={() => setDeleteModalShow(false)}
                    onSubmit={() => {
                        deleteRequestType();
                        window.location.reload();
                    }}
                    onCancel={() => setDeleteModalShow(false)}
                    numRequests={getTotalQuantity()}
                />
            )}
        </div>
    );
};

export default RequestTypeDropdown;
