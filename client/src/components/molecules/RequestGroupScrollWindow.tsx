import React, { FunctionComponent } from "react";
import RequestGroupListItem from '../atoms/RequestGroupListItem';

import RequestGroup from '../../data/types/requestGroup'

export interface Props {
  requestGroups: Array<RequestGroup>,
  selectedRequestGroup?: string,
  onRequestGroupChange: (requestGroupId: string) => void
}

const RequestGroupScrollWindow: FunctionComponent<Props> = (props: Props) => {
  const listIsEmpty = props.requestGroups.length <= 0;

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    props.onRequestGroupChange(event.currentTarget.id)
  }

  return <div className="request-group-scroll-window">
    {!listIsEmpty && props.requestGroups.map((requestGroup: RequestGroup) =>
      <div className="request-group-list-item-wrapper" id={requestGroup._id} key={requestGroup._id} onClick={onClick}>
        <RequestGroupListItem
          requestGroup={requestGroup}
          selected={props.selectedRequestGroup === requestGroup._id} />
      </div>)}
  </div>
};

export default RequestGroupScrollWindow;
