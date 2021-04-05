import { bindActionCreators, Dispatch } from "redux"
import { Col, Row } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import { connect } from "react-redux";
import { loadRequestGroup } from '../../data/actions'
import RequestGroup from '../../data/types/requestGroup'
import RequestTypeDropdownList from "./RequestTypeDropdownList";
import { RootState } from '../../data/reducers'
import { useParams } from "react-router";

import { Dropdown, DropdownButton } from "react-bootstrap"

interface StateProps {
  requestGroup: RequestGroup
}

interface DispatchProps {
  loadRequestGroup: typeof loadRequestGroup
}

interface ParamTypes {
    id: string
  }

type Props = StateProps & DispatchProps;


const AdminRequestGroupBrowser: FunctionComponent<Props> = (props: React.PropsWithChildren<Props>) => {
    //const [requestGroup, setRequestGroup] = useState<string | undefined>(props.requestGroup._id)
    const { id } = useParams<ParamTypes>();
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
    
    const {loading, error, data} = useQuery(query, {
      variables: { id: id },
      onCompleted: (data: { requestGroup: RequestGroup }) => {
          props.loadRequestGroup(data.requestGroup)
          console.log(props.requestGroup)

      },
    });
    if (error) console.log(error.graphQLErrors);
    return (
      <div>
          <Row>
            <Col className="request-group-description">
              <h1>{props.requestGroup.name}</h1>
              <p>Displaying {props.requestGroup.numOpen} total requests and {props.requestGroup.requestTypes?.length} types</p>
            </Col>
            <Col>
            <Dropdown className="request-group-button">
              <Dropdown.Toggle>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
              </Dropdown.Toggle>

              <Dropdown.Menu align="right" className="request-group-button-dropdown">
                <Dropdown.Item className="request-group-button-dropdown-item" onClick={() => {}}>Edit Group</Dropdown.Item>
                <Dropdown.Item className="request-group-button-dropdown-item" onClick={() => {}}>Create New Type</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            </Col>

          </Row>
            <RequestTypeDropdownList requestGroup={props.requestGroup} requestTypes={props.requestGroup.requestTypes}></RequestTypeDropdownList>
      </div>
    );
};
  
const mapStateToProps = (store: RootState): StateProps => {
  return {
      requestGroup: store.requestGroup.data
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return bindActionCreators(
    {
      loadRequestGroup
    },
    dispatch
  );
};

export default connect<StateProps, DispatchProps, Record<string, unknown>, RootState>(mapStateToProps, mapDispatchToProps)(AdminRequestGroupBrowser);
