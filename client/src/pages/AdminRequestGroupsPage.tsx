import React, { FunctionComponent } from "react";

import AdminPage from "../components/layouts/AdminPage";
import AdminRequestGroupList from "../components/organisms/AdminRequestGroupList";

const AdminRequestGroupsPage: FunctionComponent = () => {
    return (
        <AdminPage>
            <AdminRequestGroupList />
        </AdminPage>
    );
};

export default AdminRequestGroupsPage;
