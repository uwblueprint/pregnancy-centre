import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import SearchBarWithSubtext from "../molecules/SearchBarWithSubtext";

import RequestGroupDonorView from "./RequestGroupDonorView";
import RequestGroupList from "./RequestGroupList";
import { usePaginator } from "../utils/hooks";

const DonorRequestGroupBrowser: FunctionComponent = () => {
    const [countRequestGroups, setCountRequestGroups] = useState<number>(0);
    const [selectedRequestGroup, setSelectedRequestGroup] = useState<string | undefined>(undefined);
    const [filterString, setFilterString] = useState<string | undefined>(undefined);
    const [currentPageNumber, setCurrentPageNumber] = useState(0); // Indexing starting at 0

    const numRequestGroupsPerPage = 10;
    const pages = Math.ceil(countRequestGroups / numRequestGroupsPerPage);

    const getPageQuery = gql`
        query GetRequestGroupsPage($skip: Int!, $limit: Int!, $name: String ) {
            requestGroupsPage(skip: $skip, limit: $limit, name: $name, open: true) {
                _id
                name
                image
                countOpenRequests
            }
        }
    `;
    const paginator = usePaginator(numRequestGroupsPerPage, pages, getPageQuery, -1, 3);

    const query = gql`
        {
            countRequestGroups(open: true)
        }
    `;

    const filteredQuery = gql`
        query GetCountRequestGroups($name: String) {
            countRequestGroups(open: true, name: $name)
        }
    `;

    useQuery(query, {
        onCompleted: (data: { countRequestGroups: number }) => {
            setCountRequestGroups(data.countRequestGroups);
        }
    });

    useQuery(filteredQuery, {
        variables: Object.assign(filterString ? { name: filterString } : {}),
        onCompleted: (data: { countRequestGroups: number }) => {
            setCountRequestGroups(data.countRequestGroups);
            setCurrentPageNumber(0);
        }
    });

    const onSearch = (searchString : string) => {
        setFilterString(searchString);
        if (searchString !== undefined) {
            paginator.setQueryVariables({name: searchString})
        }
        setCurrentPageNumber(0);
    }

    return (
        <div className="donor-request-group-browser">
            <div>
                <h1 className="donor-request-group-browser-header">Our Current Needs</h1>
                <SearchBarWithSubtext
                    defaultText="Search for a need or a type"
                    subtext="Press enter to search"
                    searchWhileTyping={false}
                    onSearch={onSearch}
                />
            </div>
            <h3 className="donor-request-group-browser-info">Showing {countRequestGroups} results</h3>
            <div className="donor-request-group-browser-content">
                <div className="donor-request-group-browser-list">
                    <RequestGroupList
                        countRequestGroups={countRequestGroups}
                        selectedRequestGroup={selectedRequestGroup}
                        paginator = {paginator}
                        pages={pages}
                        currentPageNumber={currentPageNumber}
                        setCurrentPageNumber={setCurrentPageNumber}
                        onRequestGroupChange={(requestGroupdId: string | undefined) => {
                            setSelectedRequestGroup(requestGroupdId);
                        }}
                    />
                </div>
                <div className="donor-request-group-browser-indiv-view">
                    <RequestGroupDonorView requestGroupId={selectedRequestGroup} />
                </div>
            </div>
        </div>
    );
};

export default DonorRequestGroupBrowser;
