import { Dropdown, Spinner } from "react-bootstrap";
import { gql, useMutation, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

import DeleteRequestGroupDialog from "./DeleteRequestGroupDialog";
import RequestGroup from "../../data/types/requestGroup";
import RequestGroupForm from "./RequestGroupForm";
import RequestTypeDropdownList from "./RequestTypeDropdownList";
import RequestTypeForm from "./RequestTypeForm";

interface ParamTypes {
    id: string;
}

const AdminRequestGroupBrowser: FunctionComponent = () => {
    const { id } = useParams<ParamTypes>();
    const history = useHistory();
    const [requestGroup, setRequestGroup] = useState<RequestGroup | undefined>(undefined);
    const [numTypes, setNumTypes] = useState(0);
    const [showEditGroupModal, setShowEditGroupModal] = useState(false);
    const [showCreateTypeModal, setShowCreateTypeModal] = useState(false);
    const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);

    const query = gql`
        query requestGroup($id: ID) {
            requestGroup(_id: $id) {
                _id
                name
                deleted
                countOpenRequests
                requestTypes {
                    _id
                    name
                    deleted
                    requests {
                        _id
                        createdAt
                        deletedAt
                        fulfilledAt
                        quantity
                        clientName
                    }
                }
            }
        }
    `;

    const { error } = useQuery(query, {
        variables: { id: id },
        onCompleted: (data: { requestGroup: RequestGroup }) => {
            const res = JSON.parse(JSON.stringify(data.requestGroup)); // deep-copy since data object is frozen
            setRequestGroup(res);
        }
    });

    if (error) console.log(error.graphQLErrors);
    useEffect(() => {
        if (requestGroup !== undefined) {
            setNumTypes(
                requestGroup!.requestTypes
                    ? requestGroup!.requestTypes.reduce(
                          (total, requestType) => (requestType.deleted === false ? total + 1 : total),
                          0
                      )
                    : 0
            );
        }
    }, [requestGroup]);

    const deleteRequestGroupQuery = gql`
        mutation deleteRequestGroup($id: ID) {
            deleteRequestGroup(_id: $id) {
                _id
            }
        }
    `;
    const [mutateDeleteRequestGroup] = useMutation(deleteRequestGroupQuery);

    const deleteRequestGroup = async () => {
        await mutateDeleteRequestGroup({ variables: { id: requestGroup?._id } });
        // replace current page in browser so user cannot go back to non-existent requestGroup page
        history.replace("/admin");
    };

    return (
        <div>
            {requestGroup === undefined ? (
                <div className="spinner">
                    <Spinner animation="border" role="status" />
                </div>
            ) : (
                <div>
                    <div className="request-group-header">
                        <div className="request-group-description">
                            <h1 className="request-group-title">{requestGroup!.name}</h1>
                            <p>
                                Displaying {requestGroup!.countOpenRequests} total requests and {numTypes} types
                            </p>
                        </div>
                        <div>
                            <Dropdown className="request-group-button">
                                <Dropdown.Toggle bsPrefix="custom">
                                    <i className="bi bi-three-dots"></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu align="right" className="request-group-button-dropdown">
                                    <Dropdown.Item
                                        className="request-group-button-dropdown-item"
                                        onClick={() => {
                                            setShowEditGroupModal(true);
                                        }}
                                    >
                                        Edit Group
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        className="request-group-button-dropdown-item"
                                        onClick={() => {
                                            setShowCreateTypeModal(true);
                                        }}
                                    >
                                        Create New Type
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        className="request-group-button-dropdown-item"
                                        onClick={() => {
                                            setShowDeleteGroupModal(true);
                                        }}
                                    >
                                        Delete Group
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    {showEditGroupModal && (
                        <RequestGroupForm
                            onSubmitComplete={() => {
                                window.location.reload();
                            }}
                            handleClose={() => {
                                setShowEditGroupModal(false);
                            }}
                            requestGroupId={requestGroup._id}
                            operation="edit"
                        ></RequestGroupForm>
                    )}
                    {showCreateTypeModal && (
                        <RequestTypeForm
                            handleClose={() => {
                                setShowCreateTypeModal(false);
                            }}
                            onSubmit={() => {
                                window.location.reload();
                            }}
                            requestGroup={requestGroup}
                            operation="create"
                        />
                    )}
                    {showDeleteGroupModal && (
                        <DeleteRequestGroupDialog
                            requestGroupName={requestGroup.name}
                            numRequests={requestGroup.countOpenRequests ?? 0}
                            handleClose={() => {
                                setShowDeleteGroupModal(false);
                            }}
                            onCancel={() => {
                                setShowDeleteGroupModal(false);
                            }}
                            onSubmit={() => {
                                deleteRequestGroup();
                            }}
                        />
                    )}
                    {requestGroup.requestTypes && (
                        <RequestTypeDropdownList requestGroup={requestGroup} requestTypes={requestGroup.requestTypes} />
                    )}{" "}
                </div>
            )}
        </div>
    );
};

export default AdminRequestGroupBrowser;
