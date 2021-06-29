import React, { FunctionComponent, useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { Spinner } from 'react-bootstrap';

import PageNavigation from '../atoms/PageNavigation'
import RequestGroup from '../../data/types/requestGroup'
import RequestGroupScrollWindow from '../molecules/RequestGroupScrollWindow'
import { usePaginator } from '../utils/hooks';

type Props = {
  countRequestGroups: number,
  selectedRequestGroup: string | undefined,
  onRequestGroupChange: (requestGroupdId: string) => void,
}

const RequestGroupList: FunctionComponent<Props> = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [currentPageNumber, setCurrentPageNumber] = useState(0) // Indexing starting at 0
  const [currentPageData, setCurrentPageData] = useState<Array<RequestGroup>>([]);

  const numRequestGroupsPerPage = 10;
  const pages = Math.ceil(props.countRequestGroups / numRequestGroupsPerPage)

  const getPageQuery = gql`
  query GetRequestGroupsPage(
    $skip: Int!
    $limit: Int!
  ){
    requestGroupsPage(skip: $skip, limit: $limit) {
      _id
      name
      image
      countOpenRequests
    }
  }`
  const paginator = usePaginator(numRequestGroupsPerPage, pages, getPageQuery, -1, 3)
  
  useEffect(() => {
    setLoading(true);
    paginator.getPage(currentPageNumber)
    .then((page) => {
      setCurrentPageData(page);
      if (props.selectedRequestGroup === undefined) props.onRequestGroupChange(page[0]._id);
      setLoading(false);
    });
  }, [currentPageNumber]);

  return <div className="request-group-list">
    {loading === true
    ?
    <div className="spinner"> 
        <Spinner animation="border" role="status"/>
    </div>
    :
    <div className="request-group-list-scroll-window">
      <RequestGroupScrollWindow
        requestGroups={currentPageData}
        selectedRequestGroup={props.selectedRequestGroup}
        onRequestGroupChange={props.onRequestGroupChange} />
    </div>
    }
    <div className="request-group-list-page-navigation">
      <PageNavigation
        pages={pages}
        currentPage={currentPageNumber + 1}
        onPageChange={(newPage: number) => { setCurrentPageNumber(newPage - 1) }} />
    </div>
  </div>
};

export default RequestGroupList;

