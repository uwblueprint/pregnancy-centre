import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import ClientRequestTable from '../molecules/ClientRequestTable';
import Request from '../../data/types/request'
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router";

interface routeParam {
  clientName : string
}

const AdminRequestClientBrowser: FunctionComponent = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [numRequests, setNumRequests] = useState(0);

    let { clientName } = useParams<routeParam>();
    clientName = clientName.replaceAll("-"," ");

    const query = gql` 
    query {
      requests{
        _id
        client {
          fullName
        }
        dateCreated
        dateFulfilled
        deleted
        fulfilled 
        quantity
        requestType {
          name
          requestGroup {
            name
          }
        }
      }
    }
    `;
    
    const { loading, error} = useQuery(query, {
      onCompleted: (data: { requests: Request[]}) => {
        const requestsData = JSON.parse(JSON.stringify(data.requests));
        const clientRequests = requestsData.filter((req : Request) => req.client?.fullName === clientName);
        setRequests(clientRequests);
        setNumRequests(clientRequests.length);
      },
    });

    if (error) console.log(error.graphQLErrors);

    return (
      <div>
        {loading ? 
          <div className="spinner"> 
          <Spinner animation="border" role="status"/>
          </div>: 
        (<div className="admin-request-client-browser">
          <div className="client-header">
            <div className="client-requests-description">
              <h1 className="client-name">{clientName}</h1>
              <p>{numRequests > 0 ? `Displaying ${numRequests} total requests` : "No requests exist"}</p>
            </div>
          </div>
          <ClientRequestTable requests={requests} onChangeNumRequests={setNumRequests}/>
        </div>
        )}
      </div>
    );
};
  
export default AdminRequestClientBrowser;
