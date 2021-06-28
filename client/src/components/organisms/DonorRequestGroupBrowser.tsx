import React, { FunctionComponent, useState } from "react";

import RequestGroupDonorView from './RequestGroupDonorView'
import RequestGroupList from './RequestGroupList'

const DonorRequestGroupBrowser: FunctionComponent = () => {
  //const [selectedRequestGroup, setSelectedRequestGroup] = useState<string | undefined>(props.displayRequestGroups.length <= 0 ? undefined : props.displayRequestGroups[0]._id)
  const [selectedRequestGroup, setSelectedRequestGroup] = useState<string | undefined>(undefined)

  return <div className="donor-request-group-browser">
    <div>
      <h1 className="donor-request-group-browser-header">Current Needs</h1>
    </div>
    <div className="donor-request-group-browser-content">
      <div className="donor-request-group-browser-list">
        <RequestGroupList
          selectedRequestGroup={selectedRequestGroup}
          onRequestGroupChange={(requestGroupdId: string) => { setSelectedRequestGroup(requestGroupdId) }}
        />
      </div>
      <div className="donor-request-group-browser-indiv-view">
        <RequestGroupDonorView requestGroupId={selectedRequestGroup} />
      </div>
    </div>
  </div>
};

export default DonorRequestGroupBrowser;
