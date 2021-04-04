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
    const [requestGroups, setRequestGroups] = useState<Array<RequestGroup> | undefined>(props.displayRequestGroups);
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
            props.loadRequestGroups(data.requestGroups);
            props.setDisplayRequestGroups(displayRequestGroups);
        },
    });

    const onSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // if no search string entered, return all results
        if (event.target.value.length > 0) {
            setRequestGroups(props.displayRequestGroups.filter(requestGroup => requestGroup.name == event.target.value));
        } else {
            setRequestGroups(props.displayRequestGroups);
        }
    }

    const onCreateButtonClick = () => {
        console.log("create button clicked");
    }

    return (
        <span>
            <span className="top-bar">
                <span className="row">
                    <span className="title">Request Groups</span>
                    <SearchBar defaultText="Search for a group..." onSearchStringChange={onSearchStringChange} />
                    <Button text="Create" copyText="Create" onClick={onCreateButtonClick} />
                </span>
            </span>
            <RequestGroupTable requestGroups={requestGroups} />
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
