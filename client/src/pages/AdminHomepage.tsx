import React, { FunctionComponent } from 'react';
import AdminRequestGroupList from '../components/organisms/AdminRequestGroupList';
import Navbar from '../components/organisms/Navbar';

const AdminHomepage: FunctionComponent = () => {
    return (
        <div>
            {/* TODO: sub with correct links for donation hub and organization login */}
            <Navbar links={[{ name: "Donation Hub", link: "/donation-guidelines" },
            { name: "Logout", link: "/login" }]} />
            <AdminRequestGroupList />
        </div>
    );
}

export default AdminHomepage;
