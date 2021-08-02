import React, { FunctionComponent } from "react";
import Row from "react-bootstrap/Row";

import AdminDonationMatchingBrowser from "../components/organisms/AdminDonationMatchingBrowser";
import AdminPage from "../components/layouts/AdminPage";

const AdminDonationMatchingPage: FunctionComponent = () => {
    return (
        <div className="admin-donation-matching-page">
            <AdminPage>
                <Row className="admin-donation-matching-page-browser">
                    <AdminDonationMatchingBrowser />
                </Row>
            </AdminPage>
        </div>
    );
};

export default AdminDonationMatchingPage;
