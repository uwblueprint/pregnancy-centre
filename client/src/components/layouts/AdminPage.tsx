import React, { FunctionComponent } from "react";

import Navbar from "../organisms/Navbar";

const AdminPage: FunctionComponent<Record<string, unknown>> = (
    props: React.PropsWithChildren<Record<string, unknown>>
) => {
    return (
        <div className="donor-page">
            <Navbar
                leftLinks={[
                    { name: "Needs", path: "/needs" },
                    { name: "Forms", path: "/forms" }
                ]}
                rightLinks={[{ name: "Logout", path: "/" }]}
            />
            <div className="donor-page-content">{props.children}</div>
        </div>
    );
};

export default AdminPage;
