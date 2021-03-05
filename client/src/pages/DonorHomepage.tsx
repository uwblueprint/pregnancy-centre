import React, { FunctionComponent } from "react";

import DonorPage from '../components/layouts/DonorPage'
import DonorRequestGroupView from '../components/organisms/DonorRequestGroupView'
import HomepageBanner from '../components/organisms/HomepageBanner'

const DonorHomepage: FunctionComponent = () => {
  return <React.Fragment>
    <DonorPage>
      <HomepageBanner />
      <DonorRequestGroupView />
    </DonorPage>
  </React.Fragment>;
};

export default DonorHomepage;