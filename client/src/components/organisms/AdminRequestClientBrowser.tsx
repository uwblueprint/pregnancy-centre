import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import Client from '../../data/types/client'
import ClientRequestTable from '../molecules/ClientRequestTable';
import Request from '../../data/types/request'
import { Spinner } from "react-bootstrap";
import { useLocation } from 'react-router-dom';
import { useParams } from "react-router";

interface ParamTypes {
    id: string
  }

const AdminRequestClientBrowser: FunctionComponent = () => {
    const { id } = useParams<ParamTypes>();
    const [requests, setRequests] = useState([]);
    const [numRequests, setNumRequests] = useState(0);

    let clientID : string = window.location.href;
    clientID = clientID.split("client/")[1];
    let clientName = "";

    const query = gql` 
    query ($clientId: ID) {
      client ($clientId : ID) {
        fullName
      }
      requests{
        _id
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
    

    const { error } = useQuery(query, {
      variables: { id: id },
      onCompleted: (data: { request: Request, client : Client }) => {
        const res = JSON.parse(JSON.stringify(data.request)); // deep-copy since data object is frozen
        setRequests(res);
        clientName = JSON.parse(JSON.stringify(data.client));
      },
    });

    if (error) console.log(error.graphQLErrors); // printing any graphQL problems
    useEffect(() => {
      if (requests !== undefined){ // if the query was 👌
        setRequests(requests.filter((req : Request) => req.client?._id === clientID && req.fulfilled === false));
        setNumRequests(requests.length);  
      }
    }, [requests]); // note that second parameter of useEffect is that this happens only when these states change

    const handleChangeNumRequests = (num: number) => {
      setNumRequests(num);
    }

    return (
      <div>
        {requests === undefined ? 
          <div className="spinner"> 
          <Spinner animation="border" role="status"/>
        </div>: 
        (<div>
          <div className="request-group-header">
            <div className="request-group-description">
              <h1 className="request-group-title">`{clientName}`</h1>
              <p>`Displaying {numRequests} total requests`</p>
            </div>
          </div>
          <ClientRequestTable requests={requests} onChangeNumRequests={handleChangeNumRequests}/>
        </div>
        )}
      </div>
    );
};
  
export default AdminRequestClientBrowser;
