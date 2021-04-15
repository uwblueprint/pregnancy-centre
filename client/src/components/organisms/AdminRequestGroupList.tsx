import { bindActionCreators, Dispatch } from "redux"
import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import { connect } from "react-redux";

import { loadRequestGroups, setDisplayRequestGroups } from '../../data/actions/requestGroupsActions';
import { Button } from "../atoms/Button";
import RequestGroup from '../../data/types/requestGroup';
import RequestGroupTable from "../molecules/RequestGroupTable";
import { RootState } from '../../data/reducers'
import SearchBar from "../atoms/SearchBar";
import SimplePageNavigation from "../atoms/SimplePageNavigation";

interface StateProps {
    requestGroups: Array<RequestGroup>,
    displayRequestGroups: Array<RequestGroup>
}

interface DispatchProps {
    loadRequestGroups: typeof loadRequestGroups,
    setDisplayRequestGroups: typeof setDisplayRequestGroups
}

type Props = StateProps & DispatchProps;

const AdminRequestGroupList: FunctionComponent<Props> = (props: React.PropsWithChildren<Props>) => {
    const [currentPage, setCurrentPage] = useState(1); // Indexing starting at 1.
    const numGroupsPerPage = 20;

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const query = gql`
    {
      requestGroups {
        _id
        name
        dateUpdated
        deleted
        description
        requirements
        image
        numOpen
        nextRecipient {
          fullName
        }
        requestTypes {
          name
          deleted
        }
        hasAnyRequests
      }
    }`

    const sortRequestGroupsAlphabetically = (requestGroups: Array<RequestGroup>) => requestGroups.sort((rg1: RequestGroup, rg2: RequestGroup) => {
        if (rg1.name && rg2.name && rg1.name < rg2.name) { return -1; }
        if (rg1.name && rg2.name && rg1.name > rg2.name) { return 1; }
        return 0;
    });

    useQuery(query, {
        onCompleted: (data: { requestGroups: Array<RequestGroup> }) => {
            // sort fetched request groups alphabetically and filter out deleted request groups
            console.log("got request groups!");
            console.log(data.requestGroups);
            const displayRequestGroups = sortRequestGroupsAlphabetically(data.requestGroups.map(requestGroup => ({ ...requestGroup }))).filter(requestGroup => !requestGroup.deleted);
            props.loadRequestGroups(displayRequestGroups);
            props.setDisplayRequestGroups(displayRequestGroups);
        },
    });

    const onSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPage(1); // when search string changes, reset pagination
        let updatedRequestGroups = [];
        if (event.target.value.length > 0) {
            updatedRequestGroups = props.requestGroups.filter(requestGroup => requestGroup?.name?.startsWith(event.target.value));
        } else {
            // if no search string entered, return all results
            updatedRequestGroups = props.requestGroups;
        }
        props.setDisplayRequestGroups(updatedRequestGroups);
    }

    const onCreateButtonClick = () => {
        console.log("create button clicked");
    }

    return (
        <div className="admin-request-group-list">
            <div className="row">
                <span className="title">Request Groups</span>
                <span className="action-group">
                    <span className="item"><SearchBar defaultText="Search for a group..." onSearchStringChange={onSearchStringChange} /></span>
                    <span className="spacing"></span>
                    <span className="item"><Button text="Create" copyText="Create" onClick={onCreateButtonClick} /></span>
                </span>
            </div>
            <div className="page-navigation">
                <SimplePageNavigation
                    totalNumItems={props.displayRequestGroups.length}
                    numItemsPerPage={numGroupsPerPage}
                    currentPage={currentPage} // Indexing starting at 1.
                    onPageChange={handlePageChange}
                />
            </div>
            <RequestGroupTable requestGroups={props.displayRequestGroups.slice((currentPage - 1) * numGroupsPerPage,
                Math.min(
                    currentPage * numGroupsPerPage,
                    props.displayRequestGroups.length > 0 ? props.displayRequestGroups.length : Infinity
                ))} />
        </div>
    );
};

const mapStateToProps = (store: RootState): StateProps => {
    return {
        requestGroups: store.requestGroups.data,
        displayRequestGroups: store.requestGroups.displayData,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return bindActionCreators(
        {
            loadRequestGroups,
            setDisplayRequestGroups
        },
        dispatch
    );
};

export default connect<StateProps, DispatchProps, Record<string, unknown>, RootState>(mapStateToProps, mapDispatchToProps)(AdminRequestGroupList);
