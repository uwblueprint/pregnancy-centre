import React, { FunctionComponent } from "react";

interface Props {
  imageURL: string,
  requestGroupName: string, // TODO(meganniu): use RequestGroup object instead of passing RequestGroup fields
  numItemsNeeded: number,
  selected: boolean
}

const RequestGroupListItem: FunctionComponent<Props> = (props: Props) => {

  return <div className={"request-group-item" + (props.selected ? " selected" : "")}>
    <img src={props.imageURL}></img>
    <div className="request-group-info">
      <h1>{props.requestGroupName}</h1>
      <h2>{props.numItemsNeeded === 1 ? "1 item needed" : `${props.numItemsNeeded} items needed`}</h2>
    </div>
  </div>
};

export default RequestGroupListItem;
