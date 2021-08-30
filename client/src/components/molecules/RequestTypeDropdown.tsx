import { gql, useMutation } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";

import DeleteRequestTypeDialog from "../organisms/DeleteRequestTypeDialog";
import Dropdown from "../atoms/Dropdown";
import Request from "../../data/types/request";
import RequestGroup from "../../data/types/requestGroup";
import RequestsTable from "./RequestsTable";
import RequestType from "../../data/types/requestType";
import RequestTypeForm from "../organisms/RequestTypeForm";
import WarningDialog from "../atoms/WarningDialog";

interface Props {
    key?: string;
    requestType?: RequestType;
    requestGroup?: RequestGroup;
    requests?: Request[];
    deletable?: boolean;
}

const RequestTypeDropdown: FunctionComponent<Props> = (props: Props) => {
    const [numRequests, setNumRequests] = useState(0);
    const [showWarningDialog, setShowWarningDialog] = useState(false);

    const softDelete = gql`
        mutation deleteRequestType($id: ID) {
            deleteRequestType(_id: $id) {
                _id
            }
        }
    `;

    const [requestType, setRequestType] = useState(props.requestType);
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [mutateDeleteRequestType] = useMutation(softDelete);

    const getTotalCountRequests = () => {
        let totalCount = 0;
        requestType?.requests!.forEach((request) => {
            if (!request.deleted) {
                totalCount += 1;
            }
        });
        return totalCount;
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

    const handleDeleteRequestType = () => {
        setDeleteModalShow(false);
        let canDelete = true;
        if (requestType && requestType.requests) {
            requestType.requests.forEach((request) => {
                if (!request.fulfilledAt) {
                    if (request.matchedDonations) {
                        request.matchedDonations.forEach((item) => {
                            if (item.quantity > 0) {
                                canDelete = false;
                            }
                        });
                    }
                }
            });
        }
        if (canDelete) {
            deleteRequestType();
            window.location.reload();
        } else {
            setShowWarningDialog(true);
        }
    };

    useEffect(() => {
        setNumRequests(props.requests!.reduce((total, request) => (request.deletedAt == null ? total + 1 : total), 0));
    }, []);

    const handleChangeNumRequests = (num: number) => {
        setNumRequests(num);
    };
    return (
        <div className="request-type-dropdown-container">
            {showWarningDialog && (
                <WarningDialog
                    dialogTitle="This request type has unfulfilled requests with attached donation forms."
                    dialogText="It cannot be deleted until the amount contributed by all donation forms to the requests is zero."
                    onClose={() => setShowWarningDialog(false)}
                />
            )}
            <Dropdown
                title={requestType?.name ? requestType.name.toUpperCase() + " (" + numRequests + ")" : ""}
                header={
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
                        {props.deletable && (
                            <a
                                className="button-container delete"
                                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                                    onOpenDeleteRequestType();
                                    e.stopPropagation();
                                }}
                            >
                                <i className="bi bi-trash"></i>
                            </a>
                        )}
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
                        handleDeleteRequestType();
                    }}
                    onCancel={() => setDeleteModalShow(false)}
                    numRequests={getTotalCountRequests()}
                />
            )}
        </div>
    );
};

export default RequestTypeDropdown;
