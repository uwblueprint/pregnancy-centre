import React, { FunctionComponent, useEffect, useState } from "react";

import { Dispatch } from "react";
import PageNavigation from "../atoms/PageNavigation";
import RequestGroup from "../../data/types/requestGroup";
import RequestGroupScrollWindow from "../molecules/RequestGroupScrollWindow";
import { SetStateAction } from "react";
import { Spinner } from "react-bootstrap";

type Props = {
    countRequestGroups: number;
    selectedRequestGroup: string | undefined;
    paginator: {
        clear: () => void;
        getPage: (index: number) => Promise<Array<any>>;
        setQueryVariables: (queryVariables: Record<string, unknown>) => void;
    };
    pages: number;
    currentPageNumber: number;
    setCurrentPageNumber: Dispatch<SetStateAction<number>>;
    onRequestGroupChange: (requestGroupdId: string | undefined) => void;
};

const RequestGroupList: FunctionComponent<Props> = (props: Props) => {
    const [loading, setLoading] = useState(true);
    const [currentPageData, setCurrentPageData] = useState<Array<RequestGroup>>([]);

    useEffect(() => {
        setLoading(true);
        props.paginator.getPage(props.currentPageNumber).then((page) => {
            setCurrentPageData(page);
            if (props.selectedRequestGroup === undefined && page[0]) {
                props.onRequestGroupChange(page[0]._id);
            }
            setLoading(false);
        });
    }, [props.currentPageNumber, props.countRequestGroups, props.paginator]);

    return (
        <div className="request-group-list">
            {loading === true ? (
                <div className="spinner">
                    <Spinner animation="border" role="status" />
                </div>
            ) : (
                <div className="request-group-list-scroll-window">
                    <RequestGroupScrollWindow
                        requestGroups={currentPageData}
                        selectedRequestGroup={props.selectedRequestGroup}
                        onRequestGroupChange={props.onRequestGroupChange}
                    />
                </div>
            )}
            <div className="request-group-list-page-navigation">
                <PageNavigation
                    pages={props.pages}
                    currentPage={props.currentPageNumber + 1}
                    onPageChange={(newPage: number) => {
                        props.setCurrentPageNumber(newPage - 1);
                    }}
                />
            </div>
        </div>
    );
};

export default RequestGroupList;
