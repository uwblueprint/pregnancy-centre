import React, { FunctionComponent, useState } from "react";
import RequestGroupListItem from '../atoms/RequestGroupListItem';

import RequestGroup from '../../data/types/requestGroup'

export interface Props {
  requestGroups: Array<RequestGroup>,
  selectedRequestGroup?: string,
  onRequestGroupChange: (requestGroupId: string) => void
}

const RequestGroupScrollWindow: FunctionComponent<Props> = (props: Props) => {
  const listIsEmpty = props.requestGroups.length <= 0;
  const [selectedRequestGroup, setSelectedRequestGroup] = useState(props.selectedRequestGroup);

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    const newRequestGroupId = event.currentTarget.id
    setSelectedRequestGroup(newRequestGroupId)
    props.onRequestGroupChange(newRequestGroupId)
  }

  return <div className="request-group-scroll-window">
    {!listIsEmpty && props.requestGroups.map((requestGroup: RequestGroup) =>
      <div className="request-group-list-item-wrapper" id={requestGroup._id} key={requestGroup._id} onClick={onClick}>
        <RequestGroupListItem
          requestGroup={requestGroup}
          selected={selectedRequestGroup === requestGroup._id} />
      </div>)}
  </div>
};

export default RequestGroupScrollWindow;
