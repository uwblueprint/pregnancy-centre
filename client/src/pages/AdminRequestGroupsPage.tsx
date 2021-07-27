import React, { FunctionComponent } from "react";

import AdminPage from "../components/layouts/AdminPage";
import AdminRequestGroupList from "../components/organisms/AdminRequestGroupList";

const AdminRequestGroupsPage: FunctionComponent = () => {
    return (
        <div className="admin-request-groups-page">
            <AdminPage>
                <AdminRequestGroupList />
            </AdminPage>
        </div>
    );
};

export default AdminRequestGroupsPage;
