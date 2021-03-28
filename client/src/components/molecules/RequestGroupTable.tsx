import React, { FunctionComponent, useState } from "react";
import moment from 'moment';

import { Table } from "react-bootstrap";

import Tag from '../atoms/Tag'

import RequestGroup from '../../data/types/requestGroup'

export interface Props {
  requestGroups: Array<RequestGroup>
}

const RequestGroupTable: FunctionComponent<Props> = (props: Props) => {
    const [selectedRequestGroup, setSelectedRequestGroup] = useState("");

    const updateSelectedRequestGroup = (requestGroup : RequestGroup | undefined) => {
        if (requestGroup && requestGroup._id) {
            setSelectedRequestGroup(requestGroup._id);
        } else {
            setSelectedRequestGroup("");
        }
    }

    return <div className="request-group-table">
        <Table>
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
                {props.requestGroups
                    .sort((g1, g2) => {
                        if (!g1 && !g2) {
                            return 0;
                        }
                        if (!g1 || !g1.name) {
                            return 1;
                        }
                        if (!g2 || !g2.name) {
                            return -1;
                        }
                        return g1.name.toUpperCase() < g2.name?.toUpperCase() ? -1 : g1.name.toUpperCase() < g2.name?.toUpperCase() ? 1 : 0})
                    .map((requestGroup : RequestGroup) => {
                    <tr key={ requestGroup._id } 
                        onClick={() => {updateSelectedRequestGroup(requestGroup)}} 
                        onMouseEnter={() => {updateSelectedRequestGroup(requestGroup)}}
                        onMouseLeave={() => {updateSelectedRequestGroup(undefined)}}>
                        <td>{ requestGroup.name }{ selectedRequestGroup === requestGroup._id && <span className="edit-icon"/> }</td>
                        <td>{ requestGroup.numOpen }</td>
                        <td>
                            <div className="requestType-tag-list">
                                { requestGroup.requestTypes && requestGroup.requestTypes.map((requestType) => {
                                    if (requestType.name) {
                                        return(<Tag text={requestType.name}/>)
                                    } else {
                                        return
                                    }
                                })}
                            </div>
                        </td>
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
