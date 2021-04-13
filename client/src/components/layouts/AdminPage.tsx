import React, { FunctionComponent } from "react";

import Navbar from '../organisms/Navbar'

const AdminPage: FunctionComponent<Record<string, unknown>> = (props: React.PropsWithChildren<Record<string, unknown>>) => {
  return <div className="donor-page">
    <div className="donor-page-header">
      <Navbar links={ [ { name: "Donation Hub", link: "https://pregnancycentre.ca/"  }, 
                        { name: "Logout", link: "/"  } ] } />
    </div>
    <div className="donor-page-content" >
      {props.children}
    </div>
    </div>
};

export default AdminPage
