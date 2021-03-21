import React, { FunctionComponent } from "react";
import { Table } from "react-bootstrap";
import moment from 'moment';

import RequestGroupListItem from '../atoms/RequestGroupListItem';

import RequestGroup from '../../data/types/requestGroup'
import requestsReducer from "../../data/reducers/requestsReducer";

export interface Props {
  requestGroups: Array<RequestGroup>
}

const RequestGroupTable: FunctionComponent<Props> = (props: Props) => {
  return <div className="request-group-table">
    <Table hover>
        <thead>
            <tr>
                <th>Title (A-Z)</th>
                <th>Open Requests</th>
                <th>Item Types</th>
                <th>Next Recipient</th>
                <th>Last Added</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {props.requestGroups.map((requestGroup : RequestGroup) => {
                <tr>
                    <td>{ requestGroup.name }</td>
                    <td>{ requestGroup.numOpen }</td>
                    <td>TODO</td>
                    <td>TODO</td>
                    <td>{ moment(requestGroup.dateUpdated, "x").format('MMMM DD, YYYY') }</td>
                    <td><img src={ requestGroup.image }/></td>
                </tr>
            })}
        </tbody>
    </Table>
    {props.requestGroups.length == 0 && <span>There are no request groups. <a>Create one now</a></span>
    }
  </div>
};

export default RequestGroupTable;
