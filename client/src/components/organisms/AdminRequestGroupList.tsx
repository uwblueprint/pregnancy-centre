import { bindActionCreators, Dispatch } from "redux"
import { gql, useQuery } from "@apollo/client";
import { loadRequestGroups, setDisplayRequestGroups } from '../../data/actions/requestGroupsActions';
import React, { FunctionComponent, useState } from "react";
import { Button } from "../atoms/Button";
import { connect } from "react-redux";
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
    // requestGroups are all the request groups that fit the search string
    const [requestGroups, setRequestGroups] = useState<Array<RequestGroup>>(props.displayRequestGroups);
    // displayRequestGroups is a subset of requestGroups, and represents all the request groups on the current page
    const [displayRequestGroups, setDisplayRequestGroups] = useState<Array<RequestGroup>>(props.displayRequestGroups);
    const [currentPage, setCurrentPage] = useState(1); // Indexing starting at 1.
    const numGroupsPerPage = 20;

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        setDisplayRequestGroups(requestGroups.slice((newPage - 1) * numGroupsPerPage, Math.min(newPage * numGroupsPerPage, requestGroups.length - 1)));
    };

    const query = gql`
    {
      requestGroups {
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
            const displayRequestGroups = sortRequestGroupsAlphabetically(data.requestGroups.map(requestGroup => ({ ...requestGroup })));
            setRequestGroups(displayRequestGroups);
            setDisplayRequestGroups(displayRequestGroups.slice(
                (currentPage - 1) * numGroupsPerPage,
                Math.min(
                    currentPage * numGroupsPerPage,
                    displayRequestGroups.length > 0 ? displayRequestGroups.length : Infinity
                )
            ));
            props.loadRequestGroups(data.requestGroups);
            props.setDisplayRequestGroups(displayRequestGroups);
        },
    });

    const onSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let updatedRequestGroups = [];
        if (event.target.value.length > 0) {
            updatedRequestGroups = props.displayRequestGroups.filter(requestGroup => requestGroup.name == event.target.value);
        } else {
            // if no search string entered, return all results
            updatedRequestGroups = props.displayRequestGroups; 
        }
        setRequestGroups(updatedRequestGroups);
        setDisplayRequestGroups(updatedRequestGroups.slice(
            (currentPage - 1) * numGroupsPerPage,
            Math.min(
                currentPage * numGroupsPerPage,
                updatedRequestGroups.length > 0 ? updatedRequestGroups.length : Infinity
            )
        ));
    }

    const onCreateButtonClick = () => {
        console.log("create button clicked");
    }

    return (
        <span>
            <span className="row">
                <span className="title">Request Groups</span>
                <span className="action-group">
                    <span className="item"><SearchBar defaultText="Search for a group..." onSearchStringChange={onSearchStringChange} /></span>
                    <span className="spacing"></span>
                    <span className="item"><Button text="Create" copyText="Create" onClick={onCreateButtonClick} /></span>
                </span>
            </span>
            <span className="page-navigation">
                <SimplePageNavigation
                    totalNumItems={requestGroups.length}
                    numItemsPerPage={numGroupsPerPage}
                    pages={Math.ceil(requestGroups.length / numGroupsPerPage)}
                    currentPage={currentPage} // Indexing starting at 1.
                    onPageChange={handlePageChange}
                />
            </span>
            <RequestGroupTable requestGroups={displayRequestGroups} />
        </span>
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
