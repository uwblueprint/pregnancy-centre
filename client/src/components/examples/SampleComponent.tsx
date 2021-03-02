/* Imports from packages */
import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent } from "react";

import Footer from '../organisms/Footer'
import { loadData } from '../../data/actions'
import Navbar from '../organisms/Navbar'
import Request from "../../data/types/request"

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
      _id
    }
  }
`;

const SampleComponent: FunctionComponent<Props> = (props: Props) => {
  const { loading, error, data } = useQuery(sampleQuery, {
    onCompleted: (data: { requests: Array<Request> }) => {
      props.loadData(data.requests);
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return <React.Fragment>
    <Navbar />
    <p>{JSON.stringify(data)}</p>
    <Footer />
  </React.Fragment>;
};

export type { DispatchProps, Props, StateProps };
export default SampleComponent;
