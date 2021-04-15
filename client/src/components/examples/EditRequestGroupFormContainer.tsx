import { bindActionCreators, Dispatch } from "redux"
import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import { connect } from "react-redux";

import { loadRequestGroups } from '../../data/actions'
import RequestGroup from "../../data/types/requestGroup"
import RequestGroupForm from "../organisms/RequestGroupForm";
import { RootState } from '../../data/reducers'


interface DispatchProps {
  loadRequestGroups: typeof loadRequestGroups,
}

type Props = DispatchProps


const EditRequestGroupFormContainer: FunctionComponent<Props> = (props: Props) => {
  const [show, setShow] = useState(true);

  const query = gql`
  {
    requestGroups {
      _id
      name
    }
  }`

  useQuery(query, {
    onCompleted: (data: { requestGroups: Array<RequestGroup> }) => {
      // Clone state.data because sort occurs in-place.
      console.log("All request groups:")
      console.log(data.requestGroups)
      props.loadRequestGroups(data.requestGroups);
    },
  });

  return (<>{show && <RequestGroupForm onChange={()=>{}} handleClose={() => setShow(false)} operation="edit" requestGroupId="607663bb2cbfaf98de609fa3" />}</>)
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return bindActionCreators(
    {
      loadRequestGroups,
    },
    dispatch
  );
};

export default connect<Record<string, unknown>, DispatchProps, Record<string, unknown>, RootState>(null, mapDispatchToProps)(EditRequestGroupFormContainer);

