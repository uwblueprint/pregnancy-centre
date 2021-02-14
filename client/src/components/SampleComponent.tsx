/* Imports from packages */
import { gql, useQuery } from "@apollo/client";
import React from "react";

import { loadData } from '../data/actions'
import { removeTypeName } from "../data/utilities";
import Request from "../data/types/request"

interface StateProps {
  requests: Array<Request>
}

interface DispatchProps {
  loadData: typeof loadData
}

type Props = StateProps & DispatchProps;

//Edit the following as necessary according to backend gql schema/resolver
const sampleQuery = gql`
  {
    requests {
      request_id
      name
    }
  }
`;

const SampleComponent = (props: Props): React.ReactNode => {
  const { loading, error, data } = useQuery(sampleQuery, {
    onCompleted: (data: Array<Request>) => {
      props.loadData(removeTypeName(data));
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return <p>{(data as Array<Request>).toString()}</p>;
};

export type { DispatchProps, Props, StateProps };
export default SampleComponent;
