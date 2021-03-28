import React, { FunctionComponent, useState } from "react";
import moment from 'moment';

import { Spinner, Table } from "react-bootstrap";

import Tag from '../atoms/Tag'

import RequestGroup from '../../data/types/requestGroup'

export interface Props {
  requestGroups: Array<RequestGroup> | undefined
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
            {props.requestGroups !== undefined &&
                <tbody>
                    {[...props.requestGroups].sort((g1, g2) => {
                        if (!g1 && !g2) {
                            return 0
                        }
                        if (!g1 || !g1.name) {
                            return 1
                        }
                        if (!g2 || !g2.name) {
                            return -1
                        }
                        return g1.name < g2.name ? -1 : 1})
                    .map((requestGroup : RequestGroup) => 
                        <tr key={ requestGroup._id } 
                            onClick={() => {updateSelectedRequestGroup(requestGroup)}} 
                            onMouseEnter={() => {updateSelectedRequestGroup(requestGroup)}}
                            onMouseLeave={() => {updateSelectedRequestGroup(undefined)}}>
                            <td>{ requestGroup.name }{ selectedRequestGroup === requestGroup._id && <span className="edit-icon"/> }</td>
                            <td>{ requestGroup.numOpen }</td>
                            <td>
                                <div className="requestType-tag-list">
                                    { requestGroup.requestTypes && requestGroup.requestTypes.map((requestType) => {
                                        console.log(requestType)
                                        if (requestType.name) {
                                            return(<Tag text={requestType.name}/>)
                                        } else {
                                            return(<></>)
                                        }
                                    })}
                                </div>
                            </td>
                            <td>{ requestGroup.nextRecipient ? requestGroup.nextRecipient.fullName : "N/A" }</td>
                            <td>{ moment(requestGroup.dateUpdated, "x").format('MMMM DD, YYYY') }</td>
                            <td><img src={ requestGroup.image }/></td>
                        </tr>
                    )}
                </tbody>
            }
        </Table>
        {props.requestGroups === undefined && 
            <span className="spinner"> 
                <Spinner animation="border" role="status"/>
            </span>
        }
        {props.requestGroups && props.requestGroups.length == 0 && 
            <span>There are no request groups. <a>Create one now</a></span>
        }
    </div>
};

export default RequestGroupTable;
