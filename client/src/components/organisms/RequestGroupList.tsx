import React, { FunctionComponent, useState } from "react";

import PageNavigation from '../atoms/PageNavigation'
import Paginator from '../utils/paginator';
import RequestGroup from '../../data/types/requestGroup'
import RequestGroupScrollWindow from '../molecules/RequestGroupScrollWindow'

const RequestGroupList: FunctionComponent = () => {
  const [currentPage, setCurrentPage] = useState(1) // Indexing starting at 0

  const numRequestGroupsPerPage = 10
  const pages = Math.ceil(props.requestGroups.length / numGroupsPerPage)

  return <div className="request-group-list">
    <div className="request-group-list-scroll-window">
      <RequestGroupScrollWindow
        requestGroups={props.requestGroups.slice((currentPage - 1) * numGroupsPerPage, Math.min(currentPage * numGroupsPerPage, props.requestGroups.length))}
        selectedRequestGroup={props.selectedRequestGroup}
        onRequestGroupChange={props.onRequestGroupChange} />
    </div>
    <div className="request-group-list-page-navigation">
      <PageNavigation
        pages={pages}
        currentPage={currentPage}
        onPageChange={(newPage: number) => { setCurrentPage(newPage) }} />
    </div>
  </div>
};

export default RequestGroupList;

