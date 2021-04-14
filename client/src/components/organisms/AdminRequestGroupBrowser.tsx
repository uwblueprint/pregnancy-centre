import { Col, Row, Spinner } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap"
import RequestGroup from '../../data/types/requestGroup';
import RequestGroupForm from "./RequestGroupForm";
import RequestTypeDropdownList from "./RequestTypeDropdownList";
import { useParams } from "react-router";

interface ParamTypes {
    id: string
  }

const AdminRequestGroupBrowser: FunctionComponent = () => {
    const { id } = useParams<ParamTypes>();
    const [requestGroup, setRequestGroup] = useState<RequestGroup|undefined>(undefined);
    const [numTypes, setNumTypes] = useState(0);
    const [editModalShow, setEditModalShow] = useState(false);

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

    // when user clicks edit button request type
    const onOpenEditModal = () => {
        setEditModalShow(true);
    }

    const handleEditModalClose = () => {
      setEditModalShow(false)
    };

    return (
      <div>
        {requestGroup===undefined ? 
          <div className="spinner"> 
          <Spinner animation="border" role="status"/>
        </div>: 
        (<div>
          <Row>
            <Col className="request-group-description">
              <h1 className="request-group-title">{requestGroup!.name}</h1>
              <p>Displaying {requestGroup!.numOpen} total requests and {numTypes} types</p>
            </Col>
            <Col>
            <Dropdown className="request-group-button">
              <Dropdown.Toggle bsPrefix="custom">
                <i className="bi bi-three-dots"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu align="right" className="request-group-button-dropdown">
                <Dropdown.Item className="request-group-button-dropdown-item" onClick={onOpenEditModal}>Edit Group</Dropdown.Item>
                <Dropdown.Item className="request-group-button-dropdown-item" onClick={() => {}}>Create New Type</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            </Col>

          </Row>
          {
            editModalShow &&
            <RequestGroupForm handleClose={handleEditModalClose} requestGroupId={requestGroup._id} operation="edit"></RequestGroupForm>
          }
          <RequestTypeDropdownList requestGroup={requestGroup} requestTypes={requestGroup!.requestTypes}></RequestTypeDropdownList> </div>
        )}
      </div>
    );
};
  
export default AdminRequestGroupBrowser;
