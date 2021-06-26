import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import ClientRequestTable from '../molecules/ClientRequestTable';
import Request from '../../data/types/request'
import { Spinner } from "react-bootstrap";

const AdminRequestClientBrowser: FunctionComponent = () => {
    const [requests, setRequests] = useState([]);
    const [numRequests, setNumRequests] = useState(0);

    let clientName : string = window.location.href;
    clientName = clientName.split("client/")[1].replace("-", " ");

    const handleChangeNumRequests = (num: number) => {
      setNumRequests(num);
    }

    const query = gql` 
    query {
      requests{
        _id
        client {
          fullName
        }
        requestId
        dateUpdated
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
        const clientRequests = requestsData.filter((req : Request) => req.client?.fullName === clientName && req.fulfilled === false);
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
        (<div>
          <div className="request-group-header">
            <div className="request-group-description">
              <h1 className="request-group-title">{clientName}</h1>
              <p>{numRequests > 0 ? `Displaying ${numRequests} total request` : "No requests exist"}</p>
            </div>
          </div>
          <ClientRequestTable requests={requests} onChangeNumRequests={handleChangeNumRequests}/>
        </div>
        )}
      </div>
    );
};
  
export default AdminRequestClientBrowser;
