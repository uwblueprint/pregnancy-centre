import React, { FunctionComponent } from 'react';
import AdminRequestGroupList from '../components/organisms/AdminRequestGroupList';
import Navbar from '../components/organisms/Navbar';

const AdminHomepage: FunctionComponent = () => {
    return (
        <div>
            <Navbar links={[{ name: "Donation Hub", link: "/" },
            { name: "Logout", link: "/" }]} />
            <AdminRequestGroupList />
        </div>
    );
}

export default AdminHomepage;
