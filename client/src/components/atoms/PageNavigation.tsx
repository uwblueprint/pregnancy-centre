import React, { FunctionComponent, useState } from "react";
import Pagination from 'react-bootstrap/Pagination';

interface Props {
  pages: number,
  currentPage: number, // Indexing starting at 1.
  onPageChange: (newPage: number) => void
}

const PageNavigation: FunctionComponent<Props> = (props: Props) => {
  const [currentPage, setCurrentPage] = useState(props.currentPage);

  const setNewPage = (newPage: number) => {
    props.onPageChange(newPage)
    setCurrentPage(newPage)
  }

  const onPageSelect = (event: React.MouseEvent<HTMLElement>) => {
    setNewPage(parseInt(event.currentTarget.innerText))

  }

  return <React.Fragment>
    <Pagination >
      <Pagination.Prev
        disabled={currentPage <= 1}
        className="page-arrow prev-arrow"
        onClick={() => { setNewPage(currentPage - 1) }} />
      {
        Array.from(Array(props.pages).keys()).map((i: number) =>
          <Pagination.Item
            key={i}
            className={currentPage === i + 1 ? " active" : " inactive"}
            onClick={onPageSelect}
          >
            {i + 1}

          </Pagination.Item>)
      }
      <Pagination.Next
        className="page-arrow next-arrow"
        disabled={currentPage >= props.pages}
        onClick={() => { setNewPage(currentPage + 1) }} />
    </Pagination>
  </React.Fragment>
};

export default PageNavigation;
