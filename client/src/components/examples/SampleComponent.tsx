/* Imports from packages */
import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent } from "react";

import Footer from '../organisms/Footer'
import { loadRequestGroups } from '../../data/actions'
import Navbar from '../organisms/Navbar'
import RequestGroup from '../../data/types/request'

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
    requestGroups {
      name
      description
      requestTypes {
        name
        requests {
          open {
            _id
          }
        }
      }
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
    <Navbar />
    <p>{JSON.stringify(data)}</p>
    <Footer />
  </React.Fragment>;
};

export type { DispatchProps, Props, StateProps };
export default SampleComponent;
