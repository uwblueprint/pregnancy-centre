import React, { FunctionComponent, useState } from "react";

import PageNavigation from '../atoms/PageNavigation'
import RequestGroup from '../../data/types/requestGroup'
import RequestGroupScrollWindow from '../molecules/RequestGroupScrollWindow'

interface Props {
  requestGroups: Array<RequestGroup>,
  pages: number,
  currentPage: number, // Indexing starting at 1.
  onPageChange: (newPage: number) => void,
  onRequestGroupChange: (requestGroupdId: string) => void,
}

const RequestGroupList: FunctionComponent<Props> = (props: Props) => {
  const [currentPage, setCurrentPage] = useState(props.currentPage);
  const [selectedRequestGroup, setSelectedRequestGroup] = useState<string | undefined>(props.requestGroups.length <= 0 ? props.requestGroups[0]._id : undefined)

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage)
    props.onPageChange(newPage)
  }
  const onRequestGroupChange = (newRequestGroupId: string) => {
    setSelectedRequestGroup(newRequestGroupId)
    props.onRequestGroupChange(newRequestGroupId)
  }

  return <div>
    <RequestGroupScrollWindow
      requestGroups={props.requestGroups}
      selectedRequestGroup={selectedRequestGroup}
      onRequestGroupChange={props.onRequestGroupChange} />
    <PageNavigation
      pages={props.pages}
      currentPage={currentPage}
      onPageChange={onPageChange} />
  </div>
};

export default RequestGroupList;
