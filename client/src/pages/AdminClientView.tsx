import React, { FunctionComponent } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import AdminPage from "../components/layouts/AdminPage";
import AdminRequestClientBrowser from "../components/organisms/AdminRequestClientBrowser";
import ClientRequestTable from "../components/molecules/ClientRequestTable";

const AdminRequestGroupView: FunctionComponent = () => {
    return (
        <Container className="admin-homepage" fluid>
            <AdminPage></AdminPage>
        </Container>
    );
};

export default AdminRequestGroupView;
