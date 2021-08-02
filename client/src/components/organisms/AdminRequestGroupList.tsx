import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";

import RequestForm from "../organisms/RequestForm";
import RequestGroup from "../../data/types/requestGroup";
import RequestGroupForm from "../organisms/RequestGroupForm";
import RequestGroupTable from "../molecules/RequestGroupTable";
import SearchBar from "../atoms/SearchBar";
import SimplePageNavigation from "../atoms/SimplePageNavigation";
import { usePaginator } from "../utils/hooks";

const AdminRequestGroupList: FunctionComponent = () => {
    const [currentPage, setCurrentPage] = useState(0); // Indexing starting at 0.
    const [currentPageData, setCurrentPageData] = useState<Array<RequestGroup>>([]);
    const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);
    const [showCreateRequestGroupModal, setShowCreateRequestGroupModal] = useState(false);
    const [countRequestGroups, setCountRequestGroups] = useState<number>(0);
    const numRequestGroupsPerPage = 20;
    const pages = Math.ceil(countRequestGroups / numRequestGroupsPerPage);

    const getPageQuery = gql`
        query GetRequestGroupsPage($skip: Int!, $limit: Int!, $name: String) {
            requestGroupsPage(skip: $skip, limit: $limit, name: $name, open: true) {
                _id
                updatedAt
                name
                image
                countOpenRequests
                nextRecipient
                hasAnyRequests
                requestTypes {
                    _id
                    name
                    deletedAt
                }
            }
        }
    `;
    const paginator = usePaginator(numRequestGroupsPerPage, pages, getPageQuery, -1, 1);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const query = gql`
        {
            countRequestGroups(open: true)
        }
    `;

    useEffect(() => {
        paginator.getPage(currentPage).then((page) => {
            setCurrentPageData(page);
        });
    }, [currentPage, countRequestGroups]);

    useQuery(query, {
        onCompleted: (data: { countRequestGroups: number }) => {
            setCountRequestGroups(data.countRequestGroups);
        }
    });

    const onSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPageData([]);
        if (event.target.value) {
            paginator.setQueryVariables({ name: event.target.value });
        } else {
            paginator.setQueryVariables({});
        }
        paginator.clear();
        setCurrentPage(0);
    };

    return (
        <div className="admin-request-group-list">
            {showCreateRequestModal && (
                <RequestForm
                    onSubmitComplete={() => {}}
                    handleClose={() => setShowCreateRequestModal(false)}
                    operation="create"
                />
            )}
            {showCreateRequestGroupModal && (
                <RequestGroupForm
                    onSubmitComplete={() => {
                        window.location.reload();
                    }}
                    handleClose={() => setShowCreateRequestGroupModal(false)}
                    operation="create"
                />
            )}
            <div className="row">
                <span className="title">Needs</span>
                <span className="action-group">
                    <span className="item">
                        <SearchBar defaultText="Search for a group..." onSearchStringChange={onSearchStringChange} />
                    </span>
                    <span className="spacing"></span>
                    <span className="item">
                        <Dropdown className="admin-group-button">
                            <Dropdown.Toggle bsPrefix="custom">Create</Dropdown.Toggle>

                            <Dropdown.Menu align="right" className="admin-group-button-dropdown">
                                <Dropdown.Item
                                    className="admin-group-button-dropdown-item"
                                    onClick={() => {
                                        setShowCreateRequestModal(true);
                                    }}
                                >
                                    New request
                                </Dropdown.Item>
                                <Dropdown.Item
                                    className="admin-group-button-dropdown-item"
                                    onClick={() => {
                                        setShowCreateRequestGroupModal(true);
                                    }}
                                >
                                    New need
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </span>
                </span>
            </div>
            <div className="page-navigation">
                <SimplePageNavigation
                    totalNumItems={countRequestGroups}
                    numItemsPerPage={numRequestGroupsPerPage}
                    currentPage={currentPage + 1} // Indexing starting at 1.
                    onPageChange={(newPage) => handlePageChange(newPage - 1)}
                />
            </div>
            <RequestGroupTable requestGroups={currentPageData} />
        </div>
    );
};

export default AdminRequestGroupList;
