import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";

import RequestGroupDonorView from "./RequestGroupDonorView";
import RequestGroupList from "./RequestGroupList";

const DonorRequestGroupBrowser: FunctionComponent = () => {
    const [countRequestGroups, setCountRequestGroups] = useState<number>(0);
    const [selectedRequestGroup, setSelectedRequestGroup] = useState<string | undefined>(undefined);

    const query = gql`
        {
            countRequestGroups(open: true)
        }
    `;

    useQuery(query, {
        onCompleted: (data: { countRequestGroups: number }) => {
            setCountRequestGroups(data.countRequestGroups);
        }
    });

    return (
        <div className="donor-request-group-browser">
            <div>
                <h1 className="donor-request-group-browser-header">Current Needs</h1>
            </div>
            <div className="donor-request-group-browser-content">
                <div className="donor-request-group-browser-list">
                    <RequestGroupList
                        countRequestGroups={countRequestGroups}
                        selectedRequestGroup={selectedRequestGroup}
                        onRequestGroupChange={(requestGroupdId: string) => {
                            setSelectedRequestGroup(requestGroupdId);
                        }}
                    />
                </div>
                <div className="donor-request-group-browser-indiv-view">
                    <RequestGroupDonorView requestGroupId={selectedRequestGroup} />
                </div>
            </div>
        </div>
    );
};

export default DonorRequestGroupBrowser;
