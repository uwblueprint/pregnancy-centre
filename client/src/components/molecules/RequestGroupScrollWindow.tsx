import React, { FunctionComponent, useEffect, useRef } from "react";
import RequestGroupListItem from '../atoms/RequestGroupListItem';

import RequestGroup from '../../data/types/requestGroup'

export interface Props {
  requestGroups: Array<RequestGroup>,
  selectedRequestGroup?: string,
  onRequestGroupChange: (requestGroupId: string) => void
}

const RequestGroupScrollWindow: FunctionComponent<Props> = (props: Props) => {
  const scrollWindow = useRef<HTMLDivElement>(null);
  const selectedItemDiv = useRef<HTMLDivElement>(null);

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    props.onRequestGroupChange(event.currentTarget.id)
  }

  useEffect(() => {
    const requestGroupInList = props.requestGroups.find((requestGroup: RequestGroup) =>
      selectedItemDiv.current && requestGroup._id === selectedItemDiv.current.id
    );

    if (scrollWindow.current && !(selectedItemDiv.current && requestGroupInList)) {
      scrollWindow.current.scrollTop = 0
    }
  })

  return <div className="request-group-scroll-window" ref={scrollWindow}>
    {props.requestGroups.length > 0 && props.requestGroups.map((requestGroup: RequestGroup) =>
      <div
        className="request-group-list-item-wrapper"
        id={requestGroup._id}
        key={requestGroup._id}
        onClick={onClick}
        ref={props.selectedRequestGroup === requestGroup._id ? selectedItemDiv : undefined}
      >
        <RequestGroupListItem
          requestGroup={requestGroup}
          selected={props.selectedRequestGroup === requestGroup._id} />
      </div>)}
  </div>
};

export default RequestGroupScrollWindow;
