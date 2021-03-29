import { bindActionCreators, Dispatch } from "redux"
import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import { connect } from "react-redux";
import { loadRequestGroup } from '../../data/actions'
import RequestGroup from '../../data/types/requestGroup'
import RequestTypeDropdownList from "./RequestTypeDropdownList";
import { RootState } from '../../data/reducers'
import { useParams } from "react-router";

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

      },
    });
    if (error) console.log(error.graphQLErrors);
    return (
      <div>
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
