import React, { FunctionComponent, ReactElement, useState } from "react";
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

    const onSelectPrev = () => {
        if (currentPage > 1) {
            setNewPage(currentPage - 1)
        }
    }

    const onSelectNext = () => {
        if (currentPage < props.pages) {
            setNewPage(currentPage + 1)
        }
    }

    return <React.Fragment>
        <Pagination >
            <Pagination.Prev className={"page-arrow " + (currentPage <= 1 ? "disabled" : "")} onClick={onSelectPrev} />
            {
                Array.from(Array(props.pages).keys()).map((i: number) =>
                    <Pagination.Item
                        key={i}
                        className={currentPage == i + 1 ? "active" : "inactive"}
                        onClick={onPageSelect}
                    >
                        {i + 1}

                    </Pagination.Item>)
            }
            <Pagination.Next className={"page-arrow " + (currentPage >= props.pages ? "disabled" : "")} onClick={onSelectNext} />
        </Pagination>
    </React.Fragment>
};

export default PageNavigation;