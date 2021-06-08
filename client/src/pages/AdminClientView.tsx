import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router";

import AdminPage from "../components/layouts/AdminPage";
import Client from "../data/types/client";
import ClientRequestTable from "../components/molecules/ClientRequestTable";
import Container from "react-bootstrap/Container";
import Request from "../data/types/request";
import Row from "react-bootstrap/Row";


interface ParamTypes {
  id: string;
}

const AdminClientView: FunctionComponent = () => {
  const { id } = useParams<ParamTypes>();
  const [queryData, setQueryData] = useState<Request[]>([]);
  const [clientName, setClientName] = useState<string | undefined>("");
  const [openRequests, setOpenRequests] = useState(0);

  const query = gql`
    query ($c_id: ID) {
      filterClients(filter: { id: $c_id }) {
        fullName
      }
      filterRequests(filter: $c_id) {
        requestId
        quantity
        dateCreated
        fulfilled
        deleted
        client {
          fullName
        }
        requestType {
          name
          requestGroup {
            name
          }
        }
      }
    }
  `;

  const { error } = useQuery(query, {
    variables: { c_id: id },
    onCompleted: (data: {
      filterClients: [Client];
      filterRequests: [Request];
    }) => {
      console.log(data);
      console.log(id);
      const res = JSON.parse(JSON.stringify(data.filterRequests)); // deep-copy since data object is frozen
      setQueryData(res);
      const client = JSON.parse(JSON.stringify(data.filterClients[0]));
      setClientName(client.fullName);
      console.log(client?.fullName);
    },
  });

  if (error) console.log(error.graphQLErrors);

  return (
    <Container className="admin-homepage" fluid>
      <AdminPage>
        <Row className="admin-homepage">
          <div>
            {queryData === undefined ? (
              <div className="spinner">
                <Spinner animation="border" role="status" />
              </div>
            ) : (
              <div>
                <div className="request-group-header">
                  <div className="request-group-description">
                    <h1 className="request-group-title">{clientName}</h1>
                    <p>Displaying {openRequests} total requests</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <ClientRequestTable requests={queryData ? queryData : []} />
        </Row>
      </AdminPage>
    </Container>
  );
};

export default AdminClientView;
