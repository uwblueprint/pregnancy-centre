/* Imports from packages */
import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent } from "react";

import DonorPage from '../layouts/DonorPage'
import { loadRequestGroups } from '../../data/actions'
import RequestGroup from "../../data/types/requestGroup"

interface StateProps {
  requestGroups: Array<RequestGroup>
}

interface DispatchProps {
  loadRequestGroups: typeof loadRequestGroups,
}

type Props = StateProps & DispatchProps;

//Edit the following as necessary according to backend gql schema/resolver
const sampleQuery = gql`
  {
    requests {
      _id
      fulfilled
    }
  }
`;

const SampleComponent: FunctionComponent<Props> = (props: Props) => {
  const { loading, error, data } = useQuery(sampleQuery, {
    onCompleted: (data: { requestGroups: Array<RequestGroup> }) => {
      props.loadRequestGroups(data.requestGroups);
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return <React.Fragment>
    <DonorPage>
      <p>{JSON.stringify(data)}</p>
    </DonorPage>
  </React.Fragment>;
};

export type { DispatchProps, Props, StateProps };
export default SampleComponent;
