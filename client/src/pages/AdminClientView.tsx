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
  const [requests, setRequests] = useState<Request[]>([]);
  const [clientName, setClientName] = useState<string | undefined>("");
  const [openRequests, setOpenRequests] = useState(0);
  const [numRequests, setNumRequests] = useState(0)

  const query = gql`
  query($client_id: ID) {
    client(id: $client_id){
      fullName
    }
    filterRequestsByClientId(clientId: $client_id) {
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
    variables: { client_id: id },
    onCompleted: (data: { client: Client; filterRequestsByClientId: [Request] }) => {
      const res = JSON.parse(JSON.stringify(data.filterRequestsByClientId)); // deep-copy since data object is frozen
      setRequests(res);
      const client = JSON.parse(JSON.stringify(data.client));
      setClientName(client.fullName);
      const open = res.filter(
        (request: Request) =>
          request.deleted === false && request.fulfilled === false
      ).length;
      setOpenRequests(open);
    },
  });

  if (error) console.log(error.graphQLErrors);

  const handleChangeNumRequests = (num: number) => {
    setNumRequests(num)
}

  return (
    <Container className="admin-homepage" fluid>
      <AdminPage>
          <div>
            {requests === undefined ? (
              <div className="spinner">
                <Spinner animation="border" role="status" />
              </div>
            ) : (
                <div className="request-group-header">
                  <div className="request-group-description">
                    <h1 className="request-group-title">{clientName}</h1>
                    {openRequests === 0 ? (
                      <p>No Requests Exist</p>
                    ) : (
                      <p>Displaying {openRequests} total requests</p>
                    )}
                  </div>
                </div>
            )}
          </div>
          <ClientRequestTable onChangeNumRequests={handleChangeNumRequests} requests={requests ? requests : []} />
      </AdminPage>
    </Container>
  );
};

export default AdminClientView;
