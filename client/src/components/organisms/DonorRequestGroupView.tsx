import { bindActionCreators, Dispatch } from "redux"
import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import { connect } from "react-redux";

import { loadRequestGroups } from '../../data/actions'
import RequestGroup from '../../data/types/requestGroup'
import RequestGroupList from './RequestGroupList'
import { RootState } from '../../data/reducers'

interface StateProps {
  requestGroups: Array<RequestGroup>
}

interface DispatchProps {
  loadRequestGroups: typeof loadRequestGroups,
}


type Props = StateProps & DispatchProps;

const DonorRequestView: FunctionComponent<Props> = (props: React.PropsWithChildren<Props>) => {
  const [selectedRequestGroup, setSelectedRequestGroup] = useState<string | undefined>(props.requestGroups.length <= 0 ? undefined : props.requestGroups[0]._id)

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

  const { loading, error, data } = useQuery(query, {
    onCompleted: (data: { requestGroups: Array<RequestGroup> }) => {
      props.loadRequestGroups(data.requestGroups);
    },
  });


  return <RequestGroupList
    selectedRequestGroup={selectedRequestGroup}
    onRequestGroupChange={(requestGroupdId: string) => { setSelectedRequestGroup(requestGroupdId) }}
  />
};

const mapStateToProps = (store: RootState): StateProps => {
  return {
    requestGroups: store.requestGroups.data,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return bindActionCreators(
    {
      loadRequestGroups,
    },
    dispatch
  );
};

export default connect<StateProps, DispatchProps, Record<string, unknown>, RootState>(mapStateToProps, mapDispatchToProps)(DonorRequestView);