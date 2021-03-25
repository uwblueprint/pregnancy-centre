import React, { FunctionComponent } from "react";

interface Props {
  totalNumItems: number,
  numItemsPerPage: number,
  pages: number,
  currentPage: number, // Indexing starting at 1.
  onPageChange: (newPage: number) => void
}

const SimplePageNavigation: FunctionComponent<Props> = (props: Props) => {
  const setNewPage = (newPage: number) => {
    props.onPageChange(newPage)
  }

  return (
    <span className="simple-page-navigation">
        <span>
            Showing groups <b>{((props.currentPage - 1) * props.numItemsPerPage) + 1}-{Math.min(props.totalNumItems, (props.currentPage * props.numItemsPerPage))}</b> of {props.totalNumItems}
        </span>
        <span onClick={() => {setNewPage(Math.max(1, props.currentPage - 1))}} className="prev-page-arrow">
            <span className={"page-arrow" + (props.currentPage == 1 ? " disabled" : "")}/>
        </span>
        <span onClick={() => {setNewPage(Math.min(props.pages, props.currentPage + 1))}} className="next-page-arrow">
            <span className={"page-arrow" + (props.currentPage == props.pages ? " disabled" : "")}/>
        </span>
    </span>
  )
};

export default SimplePageNavigation;
