import React, { FunctionComponent, useState } from "react";
import { connect } from "react-redux";

import PageNavigation from "../atoms/PageNavigation";
import RequestGroup from "../../data/types/requestGroup";
import RequestGroupScrollWindow from "../molecules/RequestGroupScrollWindow";
import { RootState } from "../../data/reducers";

interface StateProps {
    requestGroups: Array<RequestGroup>;
}

type Props = StateProps & {
    selectedRequestGroup: string | undefined;
    onRequestGroupChange: (requestGroupdId: string) => void;
};

const RequestGroupList: FunctionComponent<Props> = (props: Props) => {
    const numGroupsPerPage = 10;
    const pages = Math.ceil(props.requestGroups.length / numGroupsPerPage);
    const [currentPage, setCurrentPage] = useState(1); // Indexing starting at 1.

    return (
        <div className="request-group-list">
            <div className="request-group-list-scroll-window">
                <RequestGroupScrollWindow
                    requestGroups={props.requestGroups.slice(
                        (currentPage - 1) * numGroupsPerPage,
                        Math.min(currentPage * numGroupsPerPage, props.requestGroups.length)
                    )}
                    selectedRequestGroup={props.selectedRequestGroup}
                    onRequestGroupChange={props.onRequestGroupChange}
                />
            </div>
            <div className="request-group-list-page-navigation">
                <PageNavigation
                    pages={pages}
                    currentPage={currentPage}
                    onPageChange={(newPage: number) => {
                        setCurrentPage(newPage);
                    }}
                />
            </div>
        </div>
    );
};

const mapStateToProps = (store: RootState): StateProps => {
    return {
        requestGroups: store.requestGroups.displayData
    };
};

export default connect<StateProps, Record<string, unknown>, Record<string, unknown>, RootState>(mapStateToProps)(
    RequestGroupList
);
