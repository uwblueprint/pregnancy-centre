import React, { FunctionComponent } from "react";

import PageNavigation from '../atoms/PageNavigation'
import RequestGroup from '../../data/types/requestGroup'
import RequestGroupScrollWindow from '../molecules/RequestGroupScrollWindow'

interface Props {
  requestGroups: Array<RequestGroup>,
  selectedRequestGroup: string | undefined,
  pages: number,
  currentPage: number, // Indexing starting at 1.
  onPageChange: (newPage: number) => void,
  onRequestGroupChange: (requestGroupdId: string) => void,
}

const RequestGroupList: FunctionComponent<Props> = (props: Props) => {
  return <div className="request-group-list">
    <RequestGroupScrollWindow
      requestGroups={props.requestGroups}
      selectedRequestGroup={props.selectedRequestGroup}
      onRequestGroupChange={props.onRequestGroupChange} />
    <div className="request-group-list-page-navigation">
      <PageNavigation
        pages={props.pages}
        currentPage={props.currentPage}
        onPageChange={props.onPageChange} />
    </div>
  </div>
};

export default RequestGroupList;
