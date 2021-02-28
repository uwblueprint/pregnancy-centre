import React, { FunctionComponent, useState } from "react";
import RequestGroupItem from '../atoms/RequestGroupItem';

// RequestGroup defintion temporary until redux changes are merged
export interface RequestGroup {
  id: string
  name: string
  image: string
  numItemsNeeded: number  // Not present in an actual RequestGroup
}

interface Props {
  requestGroups: Array<RequestGroup>,
  selectedRequestGroup: string,
  onRequestGroupChange: (requestGroupId: string) => void
}

const RequestGroupList: FunctionComponent<Props> = (props: Props) => {
  // const [selectedRequestGroup, setSelectedRequestGroup] = useState(props.requestGroups.length !== 0 ? props.requestGroups[0].id : null);
  const [selectedRequestGroup, setSelectedRequestGroup] = useState(props.selectedRequestGroup);

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    const newRequestGroupId = event.currentTarget.id
    setSelectedRequestGroup(newRequestGroupId)
    props.onRequestGroupChange(newRequestGroupId)
  }

  return <div className="request-group-scroll-window">
    {props.requestGroups.map((requestGroup: RequestGroup) =>
      <div className="request-group-list-item-wrapper" id={requestGroup.id} key={requestGroup.id} onClick={onClick}>
        <RequestGroupItem
          imageURL={requestGroup.image}
          requestGroupName={requestGroup.name}
          numItemsNeeded={requestGroup.numItemsNeeded}
          selected={selectedRequestGroup === requestGroup.id} />
      </div>)}
  </div>
};

export default RequestGroupList;
