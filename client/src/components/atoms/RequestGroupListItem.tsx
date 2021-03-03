import React, { FunctionComponent } from "react";

import RequestGroup from '../../data/types/requestGroup'

interface Props {
  requestGroup: RequestGroup,
  selected: boolean
}

const RequestGroupListItem: FunctionComponent<Props> = (props: Props) => {
  return <div className={"request-group-list-item" + (props.selected ? " selected" : "")}>
    <img src={props.requestGroup.image}></img>
    <div className="request-group-info">
      <h1>{props.requestGroup.name}</h1>
      <h2>{props.requestGroup.numOpen === 1 ? "1 item needed" : `${props.requestGroup.numOpen} items needed`}</h2>
    </div>
  </div>
};

export default RequestGroupListItem;
