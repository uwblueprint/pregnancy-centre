import { Dropdown, Spinner } from "react-bootstrap"
import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useParams } from "react-router";

import ClientRequestTable from '../molecules/ClientRequestTable';
import RequestGroup from '../../data/types/requestGroup';

interface ParamTypes {
    id: string
  }

const AdminRequestClientBrowser: FunctionComponent = () => {
    const { id } = useParams<ParamTypes>();
    const [requestGroup, setRequestGroup] = useState<RequestGroup|undefined>(undefined);
    const [numRequests, setNumRequests] = useState(0);
    const [numTypes, setNumTypes] = useState(0);

    const query = gql` 
    query getRequestGroup($id: ID) {
        requestGroup(id: $id){
        _id
        name
        deleted
        description
        requirements
        dateUpdated
        image
        numOpen
        requestTypes{
          _id
          name
          deleted
          dateUpdated
          requests{
            _id
            requestId
            dateUpdated
            dateCreated
            dateFulfilled
            deleted
            fulfilled 
            quantity
            client{
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
        const res = JSON.parse(JSON.stringify(data.requestGroup));
        setRequestGroup(res);
      },
    });

    if (error) console.log(error.graphQLErrors);
    useEffect(() => {
      if (requestGroup !== undefined){
        setNumTypes(requestGroup!.requestTypes ? requestGroup!.requestTypes.reduce((total, requestType) => (requestType.deleted === false ? total + 1 : total), 0) : 0);  
      }
    }, [requestGroup]);

    return (
      <div>
        {requestGroup===undefined ? 
          <div className="spinner"> 
          <Spinner animation="border" role="status"/>
        </div>: 
        (<div>
          <div className="request-group-header">
            <div className="request-group-description">
              <h1 className="request-group-title">smth like props.clientName</h1>
              <p>Displaying props.numReqs total requests</p>
            </div>
          </div>
          </div>
        )}
      </div>
    );
};
  
export default AdminRequestClientBrowser;
