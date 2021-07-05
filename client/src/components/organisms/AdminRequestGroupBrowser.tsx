import { Dropdown, Spinner } from "react-bootstrap"
import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useParams } from "react-router";

import RequestGroup from '../../data/types/requestGroup';
import RequestGroupForm from "./RequestGroupForm";
import RequestTypeDropdownList from "./RequestTypeDropdownList";
import RequestTypeForm from "./RequestTypeForm";

interface ParamTypes {
    id: string
  }

const AdminRequestGroupBrowser: FunctionComponent = () => {
    const { id } = useParams<ParamTypes>();
    const [requestGroup, setRequestGroup] = useState<RequestGroup|undefined>(undefined);
    const [numTypes, setNumTypes] = useState(0);
    const [showEditGroupModal, setShowEditGroupModal] = useState(false);
    const [showCreateTypeModal, setShowCreateTypeModal] = useState(false);

    const query = gql`
    query getRequestGroup($id: ID) {
        requestGroup(id: $id){
        _id
        name
        numOpen
        requestTypes{
          _id
          name
          deleted
          requests{
            _id
            dateCreated
            deleted
            fulfilled 
            quantity
            client{
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
              <h1 className="request-group-title">{requestGroup!.name}</h1>
              <p>Displaying {requestGroup!.numOpen} total requests and {numTypes} types</p>
            </div>
            <div>
              <Dropdown className="request-group-button">
                <Dropdown.Toggle bsPrefix="custom">
                  <i className="bi bi-three-dots"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu align="right" className="request-group-button-dropdown">
                  <Dropdown.Item className="request-group-button-dropdown-item" onClick={() => { setShowEditGroupModal(true) }}>Edit Group</Dropdown.Item>
                  <Dropdown.Item className="request-group-button-dropdown-item" onClick={() => { setShowCreateTypeModal(true) }}>Create New Type</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          {
            showEditGroupModal &&
            <RequestGroupForm onSubmitComplete={() => { window.location.reload() }} handleClose={()=> { setShowEditGroupModal(false) }} requestGroupId={requestGroup._id} operation="edit"></RequestGroupForm>
          }
          {
            showCreateTypeModal &&
            <RequestTypeForm 
            handleClose={()=> { setShowCreateTypeModal(false) }}   
            onSubmit={() => { window.location.reload() }} 
            requestGroup={requestGroup} 
            operation="create"/>
          }
          <RequestTypeDropdownList requestGroup={requestGroup} requestTypes={requestGroup!.requestTypes}></RequestTypeDropdownList> </div>
        )}
      </div>
    );
};
  
export default AdminRequestGroupBrowser;
