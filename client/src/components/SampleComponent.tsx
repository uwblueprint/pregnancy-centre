import React from "react";
import { useQuery, gql } from "@apollo/client";
import { removeTypeName } from "../data/utilities";

const sampleQuery = gql`
  {
    items {
      id
      propertyA
      propertyB
    }
  }
`;

const SampleComponent = (props: any) => {
  const { loading, error, data } = useQuery(sampleQuery, {
    onCompleted: (data: any) => {
      props.loadData(removeTypeName(data));
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return <p>{data}</p>;
};

export default SampleComponent;
