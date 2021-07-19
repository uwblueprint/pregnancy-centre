import React, { FunctionComponent } from "react";

import AdminPage from "../components/layouts/AdminPage";
import AdminRequestGroupList from "../components/organisms/AdminRequestGroupList";

const AdminUnmatchedDonationFormPage: FunctionComponent = () => {
    return (
        <AdminPage>
            <AdminRequestGroupList />
        </AdminPage>
    );
};

export default AdminUnmatchedDonationFormPage;
