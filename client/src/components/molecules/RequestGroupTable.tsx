import React, { FunctionComponent } from "react";
import moment from 'moment';
import { useHistory } from 'react-router-dom'

import Tag from '../atoms/Tag'

import RequestGroup from '../../data/types/requestGroup'

export interface Props {
  requestGroups: Array<RequestGroup> | undefined
}

const RequestGroupTable: FunctionComponent<Props> = (props: Props) => {
    const history = useHistory()
    return <div className="request-group-table">
        <table>
            <colgroup>
                <col className="spacing-col"/>
                <col className="name-col"/>
                <col className="numOpen-col"/>
                <col className="types-col"/>
                <col className="nextRecipient-col"/>
                <col className="date-col"/>
                <col className="image-col"/>
                <col className="spacing-col"/>
            </colgroup>
            <thead>
                <tr>
                    <th className="spacing-col"/>
                    <th className="name-col"> Title (A-Z)</th>
                    <th className="numOpen-col">Open Requests</th>
                    <th className="types-col">Item Types</th>
                    <th className="nextRecipient-col">Next Recipient</th>
                    <th className="date-col">Last Added</th>
                    <th className="image-col"></th>
                    <th className="spacing-col"/>
                </tr>
            </thead>
            {props.requestGroups !== undefined &&
                <tbody>
                    <tr className="spacing-row">
                        <td/><td/><td/><td/><td/><td/><td/><td/>
                    </tr>
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
                        <> 
                            <tr 
                                key={ requestGroup._id } 
                                className="data-row" 
                                onClick={() => {
                                    history.push('/request-group/' + requestGroup._id)
                                }
                                }>
                                <td className="spacing-col"/>
                                <td className="name-col">{ requestGroup.name }</td>
                                <td className="numOpen-col">{ requestGroup.numOpen }</td>
                                <td className="types-col">
                                    <div className="requestType-tag-list">
                                        { requestGroup.requestTypes && requestGroup.requestTypes.map((requestType) => (requestType.name && !requestType.deleted &&
                                                    <span className="requestType-tag-list-item">
                                                        <Tag text={requestType.name}/>
                                                    </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="nextRecipient-col">{ requestGroup.nextRecipient ? requestGroup.nextRecipient.fullName : "N/A" }</td>
                                <td className="date-col">{ requestGroup.hasAnyRequests ? moment(requestGroup.dateUpdated, "x").format('MMMM DD, YYYY') : "N/A" }</td>
                                <td className="image-col">
                                    <div className="img-wrapper">
                                        <img src={ requestGroup.image }/>
                                    </div>
                                </td>
                                <td className="spacing-col"/>
                            </tr>
                            <tr className="border-row">
                                <td className="spacing-col"/>
                                <td>
                                    <div className="border-line"/>
                                </td>
                                <td>
                                    <div className="border-line"/>
                                </td>
                                <td>
                                    <div className="border-line"/>
                                </td>
                                <td>
                                    <div className="border-line"/>
                                </td>
                                <td>
                                    <div className="border-line"/>
                                </td>
                                <td>
                                    <div className="border-line"/>
                                </td>
                                <td className="spacing-col"/>
                            </tr>
                        </>
                    )}
                </tbody>
            }
        </table>
        {props.requestGroups && props.requestGroups.length == 0 && 
            <span className="no-groups-msg">There are no request groups. <a className="create-group-link">Create one now</a></span>
        }
    </div>
};

export default RequestGroupTable;
