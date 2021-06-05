import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Request from "../data/types/request";
import { useParams } from "react-router";

import AdminPage from "../components/layouts/AdminPage";
import ClientRequestTable from "../components/molecules/ClientRequestTable";

interface ParamTypes {
  fullName: string;
}

const AdminClientView: FunctionComponent = () => {
  const { fullName } = useParams<ParamTypes>();
  const [firstName, lastName] = fullName.split("-");
  const [requests, setRequests] = useState<Request[]>([]);
  const [numUnfulfilledRequests, setNumUnfulfilledRequests] = useState(0);
  const [noExistingRequests, setNoExistingRequests] = useState(false);

  const query = gql`
    query getClientRequests($firstName: String) {
      getClientRequests(firstName: $firstName) {
        _id
        requestId
        fulfilled
        deleted
        quantity
        dateUpdated
        dateCreated
        requestType {
          _id
          name
          requestGroup {
            _id
            name
          }
        }
      }
    }
  `;

  const { error } = useQuery(query, {
    variables: { firstName },
    onCompleted: (data: { getClientRequests: Request[] }) => {
      const res = JSON.parse(JSON.stringify(data.getClientRequests));
      setRequests(res);
    },
  });
  if (error) return <div>Error! ${error.message}</div>;

  useEffect(() => {
    if (requests) {
      // calculate number of existing requests that are unfulfilled
      const numUnfulfilledReq = requests.reduce((total, request) => {
        return request.fulfilled || request.deleted ? total : total + 1;
      }, 0);

      // number of requests that are deleted
      const length = requests.length;
      const numDeletedRequests = requests.reduce((total, request) => {
        return request.deleted ? total + 1 : total;
      }, 0);

      setNoExistingRequests(numDeletedRequests == length);
      setNumUnfulfilledRequests(numUnfulfilledReq);
    }
  }, [requests]);

  const handleChangeRequests = (requests: Request[]) => {
    setRequests(requests);
  };
  console.log("requests:", requests);

  return (
    <Container className="admin-client-view" fluid>
      <AdminPage>
        <div className="admin-client-view-page-wrapper">
          <div className="admin-client-view-header">
            <div className="admin-client-view-description">
              <h1 className="admin-client-view-client-name">
                {[firstName, lastName].join(" ")}
              </h1>
              <p>
                {noExistingRequests
                  ? "No requests exist"
                  : `Displaying ${numUnfulfilledRequests} total requests`}
              </p>
            </div>
          </div>
          <div className="admin-client-view-page-content">
            {!noExistingRequests && (
              <div className="table-wrapper">
                <ClientRequestTable
                  requests={requests}
                  onChangeRequests={handleChangeRequests}
                />
              </div>
            )}
          </div>
        </div>
      </AdminPage>
    </Container>
  );
};

export default AdminClientView;
