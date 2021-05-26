import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useParams } from "react-router";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import AdminPage from "../components/layouts/AdminPage";
import ClientRequestTable from "../components/organisms/AdminRequestGroupBrowser";
import RequestGroup from "../data/types/requestGroup";
import RequestType from '../data/types/requestType';

interface ParamTypes {
  id: string;
}
interface requests {
    requestTypes?: RequestType[];
    requestGroup?: RequestGroup;
}

const AdminClientView: FunctionComponent = () => {
  const { id } = useParams<ParamTypes>();
  const [requestGroup, setRequestGroup] =
    useState<RequestGroup | undefined>(undefined);
  const [numTypes, setNumTypes] = useState(0);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [showCreateTypeModal, setShowCreateTypeModal] = useState(false);

  const query = gql`
    query getRequestGroup($id: ID) {
      requestGroup(id: $id) {
        _id
        name
        deleted
        description
        requirements
        dateUpdated
        image
        numOpen
        requestTypes {
          _id
          name
          deleted
          dateUpdated
          requests {
            _id
            requestId
            dateUpdated
            dateCreated
            dateFulfilled
            deleted
            fulfilled
            quantity
            client {
              _id
              fullName
            }
          }
        }
      }
    }
  `;

  const { error } = useQuery(query, {
    variables: { id: id },
    onCompleted: (data: { requestGroup: RequestGroup }) => {
      const res = JSON.parse(JSON.stringify(data.requestGroup)); // deep-copy since data object is frozen
      setRequestGroup(res);
    },
  });

  if (error) console.log(error.graphQLErrors);
  useEffect(() => {
    if (requestGroup !== undefined) {
      setNumTypes(
        requestGroup!.requestTypes
          ? requestGroup!.requestTypes.reduce(
              (total, requestType) =>
                requestType.deleted === false ? total + 1 : total,
              0
            )
          : 0
      );
    }
  }, [requestGroup]);

  return (
    <Container className="admin-homepage" fluid>
      <AdminPage>
        <Row className="admin-homepage">
          {/* <ClientRequestTable /> */}
        </Row>
      </AdminPage>
    </Container>
  );
};

export default AdminClientView;
