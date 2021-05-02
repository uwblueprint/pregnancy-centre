import { bindActionCreators, Dispatch } from "redux"
import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import { connect } from "react-redux";

import { loadRequestGroups, setDisplayRequestGroups } from '../../data/actions'
import RequestGroup from '../../data/types/requestGroup'
import RequestGroupDonorView from './RequestGroupDonorView'
import RequestGroupList from './RequestGroupList'
import { RootState } from '../../data/reducers'

interface StateProps {
  requestGroups: Array<RequestGroup>,
  displayRequestGroups: Array<RequestGroup>
}

interface DispatchProps {
  loadRequestGroups: typeof loadRequestGroups,
  setDisplayRequestGroups: typeof setDisplayRequestGroups
}


type Props = StateProps & DispatchProps;

const DonorRequestGroupBrowser: FunctionComponent<Props> = (props: React.PropsWithChildren<Props>) => {
  console.log(process.env.REACT_APP_FIREBASE_API_KEY)
  const [selectedRequestGroup, setSelectedRequestGroup] = useState<string | undefined>(props.displayRequestGroups.length <= 0 ? undefined : props.displayRequestGroups[0]._id)

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
    }
  }`

  const sortRequestGroupsAlphabetically = (requestGroups: Array<RequestGroup>) => requestGroups.sort((rg1: RequestGroup, rg2: RequestGroup) => {
    if (rg1.name && rg2.name && rg1.name < rg2.name) { return -1; }
    if (rg1.name && rg2.name && rg1.name > rg2.name) { return 1; }
    return 0;
  });

  useQuery(query, {
    onCompleted: (data: { requestGroups: Array<RequestGroup> }) => {
      // Clone state.data because sort occurs in-place.
      const displayRequestGroups = sortRequestGroupsAlphabetically(data.requestGroups.map(requestGroup => ({ ...requestGroup })));

      props.loadRequestGroups(data.requestGroups);
      props.setDisplayRequestGroups(displayRequestGroups);
      setSelectedRequestGroup(displayRequestGroups.length <= 0 ? undefined : displayRequestGroups[0]._id)
    },
  });


  return <div className="donor-request-group-browser">
    <div>
      <h1 className="donor-request-group-browser-header">Current Needs</h1>
    </div>
    <div className="donor-request-group-browser-content">
      <div className="donor-request-group-browser-list">
        <RequestGroupList
          selectedRequestGroup={selectedRequestGroup}
          onRequestGroupChange={(requestGroupdId: string) => { setSelectedRequestGroup(requestGroupdId) }}
        />
      </div>
      <div className="donor-request-group-browser-indiv-view">
        <RequestGroupDonorView requestGroupId={selectedRequestGroup} />
      </div>
    </div>
  </div>
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

export default connect<StateProps, DispatchProps, Record<string, unknown>, RootState>(mapStateToProps, mapDispatchToProps)(DonorRequestGroupBrowser);
