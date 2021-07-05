import React, { FunctionComponent } from 'react';
import AdminRequestClientBrowser from '../components/organisms/AdminRequestClientBrowser';
import Navbar from '../components/organisms/Navbar';

const ClientPage: FunctionComponent = () => {
    return (
        <div>
            <Navbar links={[{ name: "Donation Hub", link: "/" },
            { name: "Logout", link: "/" }]} />
            <AdminRequestClientBrowser/>
        </div>
    );
}

export default ClientPage;
